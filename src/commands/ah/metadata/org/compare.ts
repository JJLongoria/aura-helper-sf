import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { FileChecker, FileWriter, MetadataType, PathUtils } from '@aurahelper/core';
import { MetadataUtils, ProjectUtils, Utils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';

import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.compare');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhMetadataOrgCompareResult = {
  path: string;
};

export default class AhMetadataOrgCompare extends SfCommand<{ [key: string]: MetadataType }> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['ah:metadata:compare', 'ah:compare:metadata', 'ah:org:compare', 'ah:compare:org'];
  public static readonly flags = {
    root: Flags.directory({
      char: 'r',
      summary: generalMessages.getMessage('flags.root.summary'),
      description: generalMessages.getMessage('flags.root.description'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    'target-org': Flags.optionalOrg({
      char: 'o',
      description: messages.getMessage('flags.target-org.description'),
      summary: messages.getMessage('flags.target-org.summary'),
      required: true,
    }),
    'source-org': Flags.optionalOrg({
      char: 's',
      description: messages.getMessage('flags.source-org.description'),
      summary: messages.getMessage('flags.source-org.summary'),
      required: false,
    }),
    'api-version': Flags.orgApiVersion({
      char: 'a',
      summary: generalMessages.getMessage('flags.api-version.summary'),
      description: generalMessages.getMessage('flags.api-version.description'),
    }),
    progress: Flags.boolean({
      char: 'p',
      summary: generalMessages.getMessage('flags.progress.summary'),
      description: generalMessages.getMessage('flags.progress.description'),
    }),
    'output-file': Flags.file({
      summary: generalMessages.getMessage('flags.output-file.summary'),
      description: generalMessages.getMessage('flags.output-file.description'),
      helpValue: '<path/to/output/file>',
    }),
    csv: Flags.boolean({
      summary: messages.getMessage('flags.csv.summary'),
      description: messages.getMessage('flags.csv.description'),
    }),
  };

  public async run(): Promise<{ [key: string]: MetadataType }> {
    const { flags } = await this.parse(AhMetadataOrgCompare);
    if (!flags['source-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-compare'));
    } else {
      this.log(messages.getMessage('message.running-compare'));
    }
    const sourceAlias = flags['source-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
    const sourceNamespace = ProjectUtils.getOrgNamespace(flags.root);
    const connectorSource = new SFConnector(
      sourceAlias,
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      sourceNamespace
    );
    connectorSource.setMultiThread();
    if (flags.progress) {
      if (flags['source-org']) {
        this.log(messages.getMessage('message.describe-source'));
      } else {
        this.log(messages.getMessage('message.describe-local'));
      }
    } else if (flags['source-org']) {
      this.spinner.status = messages.getMessage('message.describe-source');
    } else {
      this.spinner.status = messages.getMessage('message.describe-local');
    }
    const metadataDetailsSource = await connectorSource.listMetadataTypes();
    connectorSource.onAfterDownloadType((status) => {
      if (flags.progress) {
        this.log(messages.getMessage('message.after-download', [status.entityType]));
      } else {
        this.spinner.status = messages.getMessage('message.after-download', [status.entityType]);
      }
    });
    const typesFromSource = await connectorSource.describeMetadataTypes(metadataDetailsSource, false, true);
    const targetAlias = flags['target-org']?.getUsername() ?? '';
    const targetNamespace = ProjectUtils.getOrgNamespace(flags.root);
    const connectorTarget = new SFConnector(
      targetAlias,
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      targetNamespace
    );
    connectorTarget.setMultiThread();
    if (flags.progress) {
      this.log(messages.getMessage('message.describe-target'));
    } else {
      this.spinner.status = messages.getMessage('message.describe-target');
    }
    const metadataDetailsTarget = await connectorTarget.listMetadataTypes();
    connectorTarget.onAfterDownloadType((status) => {
      if (flags.progress) {
        this.log(messages.getMessage('message.after-download', [status.entityType]));
      } else {
        this.spinner.status = messages.getMessage('message.after-download', [status.entityType]);
      }
    });
    const typesFromTarget = await connectorTarget.describeMetadataTypes(metadataDetailsTarget, false, true);
    if (flags.progress) {
      if (flags['source-org']) {
        this.log(messages.getMessage('messge.running-compare-orgs'));
      } else {
        this.log(messages.getMessage('messge.running-compare-local'));
      }
    } else if (flags['source-org']) {
      this.spinner.status = messages.getMessage('messge.running-compare-orgs');
    } else {
      this.spinner.status = messages.getMessage('messge.running-compare-local');
    }
    const compareResult = MetadataUtils.compareMetadata(typesFromSource, typesFromTarget);
    this.printResults(flags.json ?? false, flags.csv, compareResult);
    this.saveOutputFile(flags['output-file'], compareResult, flags.csv);
    if (!flags.progress) {
      this.spinner.stop(messages.getMessage('message.comparing-finish'));
    } else {
      this.log(messages.getMessage('message.comparing-finish'));
    }
    return compareResult;
  }

  private printResults(json: boolean, csv: boolean, compareResult: { [key: string]: MetadataType } | null): void {
    if (!json) {
      if (compareResult && Utils.hasKeys(compareResult)) {
        if (csv) {
          const csvData = CommandUtils.transformMetadataTypesToCSV(compareResult);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataTypesToTable(compareResult);
          this.table(datatable as never, {
            type: {
              header: 'Metadata Type',
            },
            object: {
              header: 'Metadata Object',
            },
            item: {
              header: 'Metadata Item',
            },
            path: {
              header: 'Path',
            },
          });
        }
      } else {
        this.log(messages.getMessage('error.no-data'));
      }
    }
  }

  private saveOutputFile(
    outputFile: string | null | undefined,
    compareResult: { [key: string]: MetadataType },
    csv: boolean
  ): void {
    if (outputFile) {
      const baseDir = PathUtils.getDirname(outputFile);
      if (!FileChecker.isExists(baseDir)) {
        FileWriter.createFolderSync(baseDir);
      }
      const content = csv
        ? CommandUtils.transformMetadataTypesToCSV(compareResult)
        : JSON.stringify(compareResult, null, 2);
      FileWriter.createFileSync(outputFile, content);
      this.log(generalMessages.getMessage('message.output-saved', [outputFile]));
    }
  }
}
