import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, Org } from '@salesforce/core';
import { FileChecker, FileWriter, MetadataDetail, MetadataType, PathUtils } from '@aurahelper/core';
import { ProjectUtils, Utils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';

import CommandUtils from '../../../../libs/utils/commandUtils';

export interface AhMetadataOrgDescribeFlags {
  root?: string;
  'target-org'?: Org;
  'api-version'?: string;
  progress?: boolean;
  all?: boolean;
  type?: string[];
  group?: boolean;
  'download-all'?: boolean;
  'output-file'?: string;
  csv?: boolean;
}

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.describe');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhMetadataOrgDescribe extends SfCommand<{ [key: string]: MetadataType }> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

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
      description: generalMessages.getMessage('flags.target-org.description'),
      summary: generalMessages.getMessage('flags.target-org.summary'),
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
    all: Flags.boolean({
      summary: messages.getMessage('flags.all.summary'),
      description: messages.getMessage('flags.all.description'),
      exclusive: ['type'],
    }),
    type: Flags.string({
      summary: messages.getMessage('flags.type.summary'),
      description: messages.getMessage('flags.type.description'),
      char: 't',
      exclusive: ['all'],
      helpValue: '<MetadataTypeName>',
      multiple: true,
    }),
    group: Flags.boolean({
      summary: messages.getMessage('flags.group.summary'),
      description: messages.getMessage('flags.group.description'),
      char: 'g',
    }),
    'download-all': Flags.boolean({
      summary: messages.getMessage('flags.download-all.summary'),
      description: messages.getMessage('flags.download-all.description'),
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
    const { flags } = await this.parse(AhMetadataOrgDescribe);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-describe'));
    } else {
      this.log(messages.getMessage('message.running-describe'));
    }
    const alias = flags['target-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
    const namespace = ProjectUtils.getOrgNamespace(flags.root);
    const connector = new SFConnector(
      alias,
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      namespace
    );
    connector.setMultiThread();
    let detailTypes: MetadataDetail[] | undefined;
    let strTypes: string[] | undefined;
    if (flags.all) {
      if (flags.progress) {
        this.log(generalMessages.getMessage('message.getting-available-types'));
      } else {
        this.spinner.status = generalMessages.getMessage('message.getting-available-types');
      }
      detailTypes = [];
      const metadataTypes = await connector.listMetadataTypes();
      for (const type of metadataTypes) {
        detailTypes.push(type);
      }
    } else if (flags.type) {
      strTypes = CommandUtils.getTypes(flags.type);
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.describe-org-types'));
    } else {
      this.spinner.status = messages.getMessage('message.describe-org-types');
    }
    connector.onAfterDownloadType((status) => {
      if (flags.progress) {
        this.log(messages.getMessage('message.after-download', [status.entityType]));
      } else {
        this.spinner.status = messages.getMessage('message.after-download', [status.entityType]);
      }
    });
    const metadata = await connector.describeMetadataTypes(detailTypes ?? strTypes, flags['download-all'], flags.group);
    if (!flags.json) {
      if (metadata && Utils.hasKeys(metadata)) {
        if (flags.csv) {
          const csvData = CommandUtils.transformMetadataTypesToCSV(metadata);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataTypesToTable(metadata);
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
    this.saveOutputFile(flags, metadata);
    if (!flags.progress) {
      this.spinner.stop(messages.getMessage('message.finished'));
    } else {
      this.log(messages.getMessage('message.finished'));
    }
    return metadata;
  }

  private saveOutputFile(flags: Partial<AhMetadataOrgDescribeFlags>, metadata: { [key: string]: MetadataType }): void {
    if (flags['output-file']) {
      const baseDir = PathUtils.getDirname(flags['output-file']);
      if (!FileChecker.isExists(baseDir)) {
        FileWriter.createFolderSync(baseDir);
      }
      const content = flags.csv
        ? CommandUtils.transformMetadataTypesToCSV(metadata)
        : JSON.stringify(metadata, null, 2);
      FileWriter.createFileSync(flags['output-file'], content);
      this.log(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
    }
  }
}
