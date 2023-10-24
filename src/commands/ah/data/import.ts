/* eslint-disable class-methods-use-this */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, Org, SfError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { AnyJson } from '@salesforce/ts-types';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { ExportTreeDataResult, FileChecker, FileReader, FileWriter, PathUtils } from '@aurahelper/core';

import CommandUtils from '../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.data.import');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhDataImportResult = {
  success: boolean;
  message: string;
};

export type AHDataImportFlags = {
  root: string;
  'api-version': string;
  'target-org': Org;
  progress: boolean;
  file: string;
  limit: number;
  'source-org': string;
  query: string;
  json: boolean;
};

export default class AhDataImport extends SfCommand<AhDataImportResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  // eslint-disable-next-line sf-plugin/no-unnecessary-aliases
  public static readonly aliases = ['ah:import:data'];

  public static readonly flags = {
    root: Flags.directory({
      char: 'r',
      summary: generalMessages.getMessage('flags.root.summary'),
      description: generalMessages.getMessage('flags.root.description'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    'api-version': Flags.orgApiVersion({
      char: 'a',
      summary: generalMessages.getMessage('flags.api-version.summary'),
      description: generalMessages.getMessage('flags.api-version.description'),
    }),
    'target-org': Flags.optionalOrg({
      char: 'o',
      description: generalMessages.getMessage('flags.target-org.description'),
      summary: generalMessages.getMessage('flags.target-org.summary'),
      required: false,
    }),
    progress: Flags.boolean({
      char: 'p',
      summary: generalMessages.getMessage('flags.progress.summary'),
      description: generalMessages.getMessage('flags.progress.description'),
    }),
    file: Flags.file({
      char: 'f',
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description'),
      helpValue: '<path/to/exported/file>',
    }),
    limit: Flags.integer({
      char: 'l',
      summary: messages.getMessage('flags.limit.summary'),
      description: messages.getMessage('flags.limit.description'),
      helpValue: '<recordsPerBatch>',
      default: 200,
      min: 1,
      max: 200,
    }),
    'source-org': Flags.string({
      char: 's',
      summary: messages.getMessage('flags.source-org.summary'),
      description: messages.getMessage('flags.source-org.description'),
      helpValue: '<usernameOrAlias>',
    }),
    query: Flags.string({
      char: 'q',
      summary: messages.getMessage('flags.query.summary'),
      description: messages.getMessage('flags.query.description'),
      helpValue: 'Select ... from ...',
      required: true,
    }),
  };

  private importConnector!: SFConnector;
  private refsByObjectType: { [key: string]: ReferenceByObject } = {};
  private recordTypeByObject: { [key: string]: RecordTypeData } = {};
  private objectsHierarchyByType: { [key: string]: ObjectHierarchyData } = {};
  private savedIdsByReference: { [key: string]: { [key: string]: string } } = {};
  private totalBatches = 0;
  private insertErrorsByBatch: { [key: string]: AnyJson } = {};
  public async run(): Promise<AhDataImportResult> {
    const { flags } = await this.parse(AhDataImport);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    if (flags.file) {
      flags.file = CommandUtils.validateFilePath(flags.file, '--file');
      if (!flags.file.endsWith('-plan.json')) {
        throw messages.createError('error.not-plan-file');
      }
    } else if (!flags['source-org']) {
      throw messages.createError('error.source-not-selected');
    } else if (!flags.query) {
      throw messages.createError('error.query-not-provided');
    }
    try {
      if (!flags.progress) {
        this.spinner.start(messages.getMessage('message.running-import'));
      }
      this.cleanWorkspace(PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export');
      if (flags.source) {
        const response = await this.startExtractingData(flags);
        for (const data of response) {
          if (data.isPlanFile) {
            flags.file = data.file;
          }
        }
      }
      const planData = this.validatePlan(flags);
      const alias = flags['target-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
      const namespace = ProjectUtils.getOrgNamespace(flags.root);
      this.importConnector = new SFConnector(
        alias,
        flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
        flags.root,
        namespace
      );
      this.importConnector.setMultiThread();
      await this.startImportingData(flags, planData);
      if (Object.keys(this.insertErrorsByBatch).length > 0) {
        const folder = PathUtils.getDirname(flags.file ?? '') + '/errors';
        if (FileChecker.isExists(folder)) {
          FileWriter.delete(folder);
        }
        FileWriter.createFolderSync(folder);
        Object.keys(this.insertErrorsByBatch).forEach((batchName) => {
          FileWriter.createFileSync(
            folder + '/' + batchName + '_errors.json',
            JSON.stringify(this.insertErrorsByBatch[batchName], null, 2)
          );
        });
        if (flags.progress) {
          this.log(messages.getMessage('error.data-not-imported', [folder]));
        } else {
          this.spinner.status = messages.getMessage('error.data-not-imported', [folder]);
        }
        return {
          success: false,
          message: messages.getMessage('error.data-not-imported', [folder]),
        };
      } else {
        if (flags.progress) {
          this.log(messages.getMessage('message.import-success'));
        } else {
          this.spinner.stop(messages.getMessage('message.import-success'));
        }
        return {
          success: true,
          message: messages.getMessage('message.import-success'),
        };
      }
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private async startExtractingData(flags: Partial<AHDataImportFlags>): Promise<ExportTreeDataResult[]> {
    try {
      if (flags.progress) {
        this.log(messages.getMessage('message.start-extracting-data', [flags['source-org']]));
      } else {
        this.spinner.status = messages.getMessage('message.start-extracting-data', [flags['source-org']]);
      }
      const connector = new SFConnector(
        flags['source-org'],
        flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root ?? '')?.sourceApiVersion,
        flags.root
      );
      const response = await connector.exportTreeData(
        flags.query ?? '',
        PathUtils.getAuraHelperSFDXTempFilesPath() + '/export'
      );
      return response;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private async startImportingData(flags: Partial<AHDataImportFlags>, planData: ExportPlan[]): Promise<AnyJson> {
    const tempFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';
    try {
      const planFolder = PathUtils.getDirname(flags.file ?? '');
      await this.loadStoredRecordTypes(flags);
      this.createReferencesMap(flags, planData, planFolder);
      this.resolveRecordTypeReferences(flags, planData, planFolder);
      this.createRecordsHierarchy(flags, planData, planFolder);
      this.createBatches(flags, planData);
      await this.insertBatches(flags, planData);
      if (Object.keys(this.insertErrorsByBatch).length > 0) {
        await this.cleanInsertedRecords(flags, tempFolder);
      }
      return this.insertErrorsByBatch;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private async loadStoredRecordTypes(flags: Partial<AHDataImportFlags>): Promise<void> {
    try {
      if (flags.progress) {
        this.log(messages.getMessage('message.loading-record-types'));
      } else {
        this.spinner.status = messages.getMessage('message.loading-record-types');
      }
      const records = await this.importConnector.query<RecordTypeRecord>(
        'Select Id, Name, DeveloperName, SobjectType from RecordType'
      );
      for (const record of records) {
        const objType = record.SobjectType;
        if (!this.recordTypeByObject[objType]) {
          this.recordTypeByObject[record.SobjectType] = {
            sObject: record.SobjectType,
            recordTypes: {},
          };
        }
        this.recordTypeByObject[record.SobjectType].recordTypes[record.DeveloperName] = record;
      }
      if (flags.progress) {
        this.log(messages.getMessage('message.record-types-loaded'));
      } else {
        this.spinner.status = messages.getMessage('message.record-types-loaded');
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private createReferencesMap(flags: Partial<AHDataImportFlags>, planData: ExportPlan[], planFolder: string): void {
    if (flags.progress) {
      this.log(messages.getMessage('message.save-references-map'));
    } else {
      this.spinner.status = messages.getMessage('message.save-references-map');
    }
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          if (!this.refsByObjectType[plan.sobject]) {
            this.refsByObjectType[plan.sobject] = {
              plan,
              references: [],
            };
          }
          const reference = record['attributes'];
          this.refsByObjectType[plan.sobject].references.push('@' + reference['referenceId']);
        }
      }
    }
  }

  private resolveRecordTypeReferences(
    flags: Partial<AHDataImportFlags>,
    planData: ExportPlan[],
    planFolder: string
  ): void {
    if (flags.progress) {
      this.log(messages.getMessage('message.resolving-record-types'));
    } else {
      this.spinner.status = messages.getMessage('message.resolving-record-types');
    }
    for (const plan of planData) {
      if (flags.progress) {
        this.log(messages.getMessage('message.resolving-record-type', [plan.sobject]));
      } else {
        this.spinner.status = messages.getMessage('message.resolving-record-type', [plan.sobject]);
      }
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          if (record['RecordType']) {
            const recordType = record['RecordType'] as RecordTypeRecord;
            if (!recordType['DeveloperName']) {
              throw messages.createError('error.record-type');
            }
            if (this.recordTypeByObject[plan.sobject]) {
              const devName = recordType['DeveloperName'];
              if (this.recordTypeByObject[plan.sobject].recordTypes[devName]) {
                record['RecordTypeId'] = this.recordTypeByObject[plan.sobject].recordTypes[devName].Id;
                delete record['RecordType'];
              } else {
                throw messages.createError('error.record-type-not-exists', [plan.sobject, devName]);
              }
            } else {
              throw messages.createError('error.record-type-not-exists-obj', [plan.sobject]);
            }
          }
        }
        FileWriter.createFileSync(filePath, JSON.stringify(fileData, null, 2));
      }
    }
  }

  private createRecordsHierarchy(flags: Partial<AHDataImportFlags>, planData: ExportPlan[], planFolder: string): void {
    if (flags.progress) {
      this.log(messages.getMessage('message.resolving-self-references'));
    } else {
      this.spinner.status = messages.getMessage('message.resolving-self-references');
    }
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          let haveParentId = false;
          if (record['MasterRecordId']) {
            delete record['MasterRecordId'];
          }
          Object.keys(record).forEach((field) => {
            if (field !== 'attributes') {
              const val = record[field];
              if (this.refsByObjectType[plan.sobject]) {
                if (typeof val === 'string' && this.refsByObjectType[plan.sobject].references.includes(val)) {
                  haveParentId = true;
                }
              }
            }
          });
          if (haveParentId) {
            if (!this.objectsHierarchyByType[plan.sobject]) {
              this.objectsHierarchyByType[plan.sobject] = {
                masters: [],
                childs: [],
              };
            }
            this.objectsHierarchyByType[plan.sobject].childs.push(record);
          } else {
            if (!this.objectsHierarchyByType[plan.sobject]) {
              this.objectsHierarchyByType[plan.sobject] = {
                masters: [],
                childs: [],
              };
            }
            this.objectsHierarchyByType[plan.sobject].masters.push(record);
          }
        }
      }
    }
  }

  private createBatches(flags: Partial<AHDataImportFlags>, planData: ExportPlan[]): void {
    if (flags.progress) {
      this.log(messages.getMessage('message.creating-batches'));
    } else {
      this.spinner.status = messages.getMessage('message.creating-batches');
    }
    const batchFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';
    this.totalBatches = 0;
    let totalRecords = 0;
    for (const plan of planData) {
      if (this.objectsHierarchyByType[plan.sobject]) {
        let counter = 1;
        let batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        const mastersFolder = batchFolder + '/' + plan.sobject + '/masters';
        const childsFolder = batchFolder + '/' + plan.sobject + '/childs';
        let records = [];
        for (const record of this.objectsHierarchyByType[plan.sobject].masters) {
          totalRecords++;
          if (flags.limit && records.length < flags.limit) {
            records.push(record);
          } else {
            this.totalBatches++;
            if (!FileChecker.isExists(mastersFolder)) {
              FileWriter.createFolderSync(mastersFolder);
            }
            FileWriter.createFileSync(mastersFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
            records = [];
            counter++;
            batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
            records.push(record);
          }
        }
        if (records.length > 0) {
          this.totalBatches++;
          if (!FileChecker.isExists(mastersFolder)) {
            FileWriter.createFolderSync(mastersFolder);
          }
          FileWriter.createFileSync(mastersFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
          records = [];
          counter++;
          batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        }
        for (const record of this.objectsHierarchyByType[plan.sobject].childs) {
          totalRecords++;
          if (flags.limit && records.length < flags.limit) {
            records.push(record);
          } else {
            this.totalBatches++;
            if (!FileChecker.isExists(childsFolder)) {
              FileWriter.createFolderSync(childsFolder);
            }
            FileWriter.createFileSync(childsFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
            records = [];
            counter++;
            batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
            records.push(record);
          }
        }
        if (records.length > 0) {
          this.totalBatches++;
          if (!FileChecker.isExists(childsFolder)) {
            FileWriter.createFolderSync(childsFolder);
          }
          FileWriter.createFileSync(childsFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
          records = [];
          counter++;
          batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        }
      }
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.batches-created', [totalRecords, this.totalBatches]));
    } else {
      this.spinner.status = messages.getMessage('message.batches-created', [totalRecords, this.totalBatches]);
    }
  }

  private async insertBatches(flags: Partial<AHDataImportFlags>, planData: ExportPlan[]): Promise<void> {
    try {
      if (flags.progress) {
        this.log(messages.getMessage('message.start-insert-job'));
      } else {
        this.spinner.status = messages.getMessage('message.start-insert-job');
      }
      const batchFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';

      for (const plan of planData) {
        const mastersFolder = plan.sobject + '/masters';
        const childsFolder = plan.sobject + '/childs';
        this.resolveReferences(flags, batchFolder + '/' + mastersFolder, batchFolder + '/' + childsFolder);
        // eslint-disable-next-line no-await-in-loop
        await this.insertMasters(flags, plan, batchFolder, mastersFolder);
        // eslint-disable-next-line no-await-in-loop
        await this.insertChilds(flags, plan, batchFolder, childsFolder);
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private async insertMasters(
    flags: Partial<AHDataImportFlags>,
    plan: ExportPlan,
    batchFolder: string,
    mastersFolder: string
  ): Promise<void> {
    if (FileChecker.isExists(batchFolder + '/' + mastersFolder)) {
      const batchFiles = FileReader.readDirSync(batchFolder + '/' + mastersFolder);
      if (batchFiles.length > 0) {
        if (Object.keys(this.savedIdsByReference).length > 0) {
          if (flags.progress) {
            this.log(messages.getMessage('message.execute-insert-operation', [plan.sobject]));
          } else {
            this.spinner.status = messages.getMessage('message.execute-insert-operation', [plan.sobject]);
          }
        }
        for (const batchFile of batchFiles) {
          const batchName = batchFile.replace('.json', '');
          if (flags.progress) {
            this.log(messages.getMessage('message.running-batch', [batchName]));
          } else {
            this.spinner.status = messages.getMessage('message.running-batch', [batchName]);
          }
          try {
            // eslint-disable-next-line no-await-in-loop
            const response = await this.importConnector.importTreeData(mastersFolder + '/' + batchFile);
            if (response.results) {
              for (const insertResult of response.results) {
                this.savedIdsByReference[insertResult.refId] = {
                  id: insertResult.id,
                  sobject: insertResult.sobject,
                };
              }
            } else {
              this.insertErrorsByBatch[batchName] = {
                name: batchName,
                file: batchFolder + '/' + mastersFolder + '/' + batchFile,
                errors: response.errors,
              };
            }
            return;
          } catch (error) {
            const err = error as Error;
            throw new SfError(err.message);
          }
        }
      }
    }
  }

  private async insertChilds(
    flags: Partial<AHDataImportFlags>,
    plan: ExportPlan,
    batchFolder: string,
    childsFolder: string
  ): Promise<void> {
    if (FileChecker.isExists(batchFolder + '/' + childsFolder)) {
      const batchFiles = FileReader.readDirSync(batchFolder + '/' + childsFolder);
      if (batchFiles.length > 0) {
        if (Object.keys(this.savedIdsByReference).length > 0) {
          if (flags.progress) {
            this.log(messages.getMessage('message.execute-insert-child-operations', [plan.sobject]));
          } else {
            this.spinner.status = messages.getMessage('message.execute-insert-child-operations', [plan.sobject]);
          }
        }
        for (const batchFile of batchFiles) {
          const batchName = batchFile.replace('.json', '');
          if (flags.progress) {
            this.log(messages.getMessage('message.running-batch', [batchName]));
          } else {
            this.spinner.status = messages.getMessage('message.running-batch', [batchName]);
          }
          try {
            // eslint-disable-next-line no-await-in-loop
            const response = await this.importConnector.importTreeData(childsFolder + '/' + batchFile);
            if (response.results) {
              for (const insertResult of response.results) {
                this.savedIdsByReference[insertResult.refId] = {
                  id: insertResult.id,
                  sobject: insertResult.sobject,
                };
              }
            } else {
              this.insertErrorsByBatch[batchName] = {
                name: batchName,
                file: batchFolder + '/' + childsFolder + '/' + batchFile,
                errors: response.errors,
              };
            }
          } catch (error) {
            const err = error as Error;
            throw new SfError(err.message);
          }
        }
      }
    }
  }

  private resolveReferences(flags: Partial<AHDataImportFlags>, mastersFolder: string, childsFolder: string): void {
    if (Object.keys(this.savedIdsByReference).length > 0) {
      if (flags.progress) {
        this.log(messages.getMessage('message.resolving-references'));
      } else {
        this.spinner.status = messages.getMessage('message.resolving-references');
      }
      if (FileChecker.isExists(mastersFolder)) {
        const batchFiles = FileReader.readDirSync(mastersFolder);
        if (batchFiles.length > 0) {
          for (const batchFile of batchFiles) {
            const records = JSON.parse(FileReader.readFileSync(mastersFolder + '/' + batchFile)) as FileData;
            for (const record of records.records) {
              Object.keys(record).forEach((field) => {
                const fieldVal = record[field] as string;
                if (this.savedIdsByReference[fieldVal]) {
                  record[field] = this.savedIdsByReference[fieldVal]['id'];
                }
              });
            }
            FileWriter.createFileSync(mastersFolder + '/' + batchFile, JSON.stringify(records, null, 2));
          }
        }
      }
      if (FileChecker.isExists(childsFolder)) {
        const batchFiles = FileReader.readDirSync(childsFolder);
        if (batchFiles.length > 0) {
          for (const batchFile of batchFiles) {
            const records = JSON.parse(FileReader.readFileSync(childsFolder + '/' + batchFile)) as FileData;
            for (const record of records.records) {
              Object.keys(record).forEach((field) => {
                const fieldVal = record[field] as string;
                if (this.savedIdsByReference[fieldVal]) {
                  record[field] = this.savedIdsByReference[fieldVal]['id'];
                }
              });
            }
            FileWriter.createFileSync(childsFolder + '/' + batchFile, JSON.stringify(records, null, 2));
          }
        }
      }
    }
  }

  private async cleanInsertedRecords(flags: Partial<AHDataImportFlags>, tempFolder: string): Promise<void> {
    try {
      if (flags.progress) {
        this.log(messages.getMessage('message.error-founds'));
      } else {
        this.spinner.status = messages.getMessage('message.error-founds');
      }
      const idsByType: { [key: string]: string[] } = {};
      Object.keys(this.savedIdsByReference).forEach((reference) => {
        const refData = this.savedIdsByReference[reference];
        const sObject = refData['sobject'];
        if (!idsByType[sObject]) {
          idsByType[sObject] = [];
        }
        idsByType[sObject].push(refData['id']);
      });
      for (const sobject of Object.keys(idsByType)) {
        if (!flags.json) {
          if (flags.progress) {
            this.log(messages.getMessage('message.rollback', [sobject]));
          } else {
            this.spinner.status = messages.getMessage('message.rollback', [sobject]);
          }
        }
        const csvContent = 'Id\n' + idsByType[sobject].join('\n');
        const csvFile = sobject + '_deleteFile.csv';
        FileWriter.createFileSync(tempFolder + '/' + csvFile, csvContent);
        // eslint-disable-next-line no-await-in-loop
        await this.importConnector.bulkDelete(csvFile, sobject);
        if (flags.progress) {
          this.log(messages.getMessage('message.rollback-finished', [sobject]));
        } else {
          this.spinner.status = messages.getMessage('message.rollback-finished', [sobject]);
        }
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private validatePlan(flags: Partial<AHDataImportFlags>): ExportPlan[] {
    try {
      const data = FileReader.readFileSync(flags.file ?? '');
      const planData = JSON.parse(data) as ExportPlan[];
      const planFolder = PathUtils.getDirname(flags.file ?? '');
      const notExistingFiles = this.getNotExistingFiles(planData, planFolder);
      if (notExistingFiles.length > 0) {
        throw new SfError(messages.getMessage('error.files-not-exists', [notExistingFiles.join(',')]));
      } else {
        return planData;
      }
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private getNotExistingFiles(planData: ExportPlan[], planFolder: string): string[] {
    const notExistingFiles: string[] = [];
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        if (!FileChecker.isExists(filePath)) {
          notExistingFiles.push(filePath);
        }
      }
    }
    return notExistingFiles;
  }

  private formatBatchCounter(counter: number): string {
    if (counter < 10) {
      return '0000' + counter.toString();
    } else if (counter < 100) {
      return '000' + counter.toString();
    } else if (counter < 1000) {
      return '00' + counter.toString();
    } else if (counter < 10000) {
      return '0' + counter.toString();
    } else {
      return counter.toString();
    }
  }

  private cleanWorkspace(tempFolder: string): void {
    if (FileChecker.isExists(tempFolder)) {
      FileWriter.delete(tempFolder);
    }
    FileWriter.createFolderSync(tempFolder);
  }
}

interface ObjectHierarchyData {
  masters: SFRecord[];
  childs: SFRecord[];
}

interface ExportPlan {
  sobject: string;
  files: string[];
}

interface ReferenceByObject {
  plan: ExportPlan;
  references: string[];
}

interface SFRecord {
  [key: string]: AnyJson | RecordTypeRecord;
  attributes: { [key: string]: string };
}

interface FileData {
  records: SFRecord[];
}

interface RecordTypeData {
  sObject: string;
  recordTypes: { [key: string]: RecordTypeRecord };
}

interface RecordTypeRecord {
  Id: string;
  Name: string;
  DeveloperName: string;
  SobjectType: string;
}
