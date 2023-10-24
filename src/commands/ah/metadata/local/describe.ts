/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { CoreUtils, FileChecker, FileWriter, MetadataType, PathUtils } from '@aurahelper/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';
import { MetadataFactory } from '@aurahelper/metadata-factory';

import CommandUtils from '../../../../libs/utils/commandUtils';

const Utils = CoreUtils.Utils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.local.describe');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhMetadataLocalDescribe extends SfCommand<{ [key: string]: MetadataType }> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:describe:local:metadata',
    'ah:describe:metadata:local',
    'ah:metadata:describe:local',
    'ah:local:metadata:describe',
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
    const { flags } = await this.parse(AhMetadataLocalDescribe);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (!flags.all && !flags.type) {
      throw new SfError(messages.getMessage('error.missing-types'));
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-describe'));
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
    const metadataDetails = await connector.listMetadataTypes();
    if (flags.progress) {
      this.log(messages.getMessage('message.describe-local-types'));
    } else {
      this.spinner.status = messages.getMessage('message.describe-local-types');
    }
    const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
    const metadataFromFileSystem = MetadataFactory.createMetadataTypesFromFileSystem(
      folderMetadataMap,
      flags.root,
      flags.group
    );
    let metadata: { [key: string]: MetadataType } = {};
    if (flags.all) {
      metadata = metadataFromFileSystem;
    } else if (flags.type) {
      const types = CommandUtils.getTypes(flags.type);
      for (const type of types) {
        if (metadataFromFileSystem[type]) {
          metadata[type] = metadataFromFileSystem[type];
        }
      }
    }
    if (!flags.json) {
      if (metadata && Utils.hasKeys(metadata)) {
        if (flags.csv) {
          const csvData = CommandUtils.transformMetadataTypesToCSV(metadata);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataTypesToTable(metadata);
          this.table(
            datatable as never,
            {
              columns: [
                {
                  key: 'type',
                  label: 'Metadata Type',
                },
                {
                  key: 'object',
                  label: 'Metadata Object',
                },
                {
                  key: 'item',
                  label: 'Metadata Item',
                },
                {
                  key: 'path',
                  label: 'Path',
                },
              ],
            } as never
          );
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
      FileWriter.createFileSync(flags['output-file'], JSON.stringify(metadata, null, 2));
      this.log(generalMessages.getMessage('message.output-saved', [flags.outputfile]));
    }
    return metadata;
  }
}
