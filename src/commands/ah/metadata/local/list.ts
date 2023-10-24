/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { FileChecker, FileWriter, MetadataDetail, PathUtils } from '@aurahelper/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';
import { MetadataFactory } from '@aurahelper/metadata-factory';

import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.local.list');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhMetadataLocalList extends SfCommand<MetadataDetail[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:list:local:metadata',
    'ah:list:metadata:local',
    'ah:metadata:list:local',
    'ah:local:metadata:list',
    'ah:local:list:metadata',
  ];

  public static readonly flags = {
    root: Flags.directory({
      char: 'r',
      summary: generalMessages.getMessage('flags.root.summary'),
      description: generalMessages.getMessage('flags.root.description'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    progress: Flags.boolean({
      char: 'p',
      summary: generalMessages.getMessage('flags.progress.summary'),
      description: generalMessages.getMessage('flags.progress.description'),
    }),
    'api-version': Flags.orgApiVersion({
      char: 'a',
      summary: generalMessages.getMessage('flags.api-version.summary'),
      description: generalMessages.getMessage('flags.api-version.description'),
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

  public async run(): Promise<MetadataDetail[]> {
    const { flags } = await this.parse(AhMetadataLocalList);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-list'));
    }
    const alias = ProjectUtils.getOrgAlias(flags.root);
    const namespace = ProjectUtils.getOrgNamespace(flags.root);
    const connector = new SFConnector(
      alias,
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      namespace
    );
    connector.setMultiThread();
    if (flags.progress) {
      this.log(generalMessages.getMessage('message.getting-available-types'));
    } else {
      this.spinner.status = generalMessages.getMessage('message.getting-available-types');
    }
    const metadata: MetadataDetail[] = [];
    const metadataDetails = await connector.listMetadataTypes();
    const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
    const metadataFromFileSystem = MetadataFactory.createMetadataTypesFromFileSystem(folderMetadataMap, flags.root);
    Object.keys(folderMetadataMap).forEach((folder) => {
      const metadataType = folderMetadataMap[folder];
      if (metadataFromFileSystem[metadataType.xmlName]) {
        metadata.push(metadataType);
      }
    });
    if (!flags.json) {
      if (metadataDetails?.length > 0) {
        if (flags.csv) {
          const csvData = CommandUtils.transformMetadataDetailsToCSV(metadata);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataDetailsToTable(metadata);
          this.table(datatable as never, {
            columns: [
              {
                key: 'name',
                label: 'Name',
              },
              {
                key: 'directory',
                label: 'Directory',
              },
              {
                key: 'suffix',
                label: 'Suffix',
              },
            ] as never,
          });
        }
      } else {
        this.log(messages.getMessage('error.no-data'));
      }
    }
    if (flags['output-file']) {
      const baseDir = PathUtils.getDirname(flags['output-file']);
      if (!FileChecker.isExists(baseDir)) {
        FileWriter.createFolderSync(baseDir);
      }
      const content = flags.csv
        ? CommandUtils.transformMetadataDetailsToCSV(metadata)
        : JSON.stringify(metadata, null, 2);
      FileWriter.createFileSync(flags['output-file'], content);
      this.log(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
    }
    return metadata;
  }
}
