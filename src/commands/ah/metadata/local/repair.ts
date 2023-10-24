/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { DependenciesManager } from '@aurahelper/dependencies-manager';
import { FileChecker, FileWriter, MetadataType, PathUtils, ProgressStatus } from '@aurahelper/core';
import { ProjectUtils, Utils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';

import CommandUtils from '../../../../libs/utils/commandUtils';

export interface AhMetadataLocalRepairFlags {
  root: string;
  'api-version': string;
  progress: boolean;
  all: boolean;
  type: string[];
  'only-check': boolean;
  compress: boolean;
  'sort-order': string;
  ignore: boolean;
  file: string;
  'output-file': string;
}

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.local.repair');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];
const IGNORE_FILE_NAME = '.ahignore.json';

export default class AhMetadataLocalRepair extends SfCommand<AnyJson> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:repair:local:metadata',
    'ah:repair:metadata:local',
    'ah:local:metadata:repair',
    'ah:local:repair:metadata',
    'ah:metadata:repair:local',
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
    'only-check': Flags.boolean({
      summary: messages.getMessage('flags.only-check.summary'),
      description: messages.getMessage('flags.only-check.description'),
    }),
    compress: Flags.boolean({
      summary: messages.getMessage('flags.compress.summary'),
      description: messages.getMessage('flags.compress.description'),
      char: 'c',
    }),
    'sort-order': Flags.string({
      summary: generalMessages.getMessage('flags.sort-order.summary'),
      description: generalMessages.getMessage('flags.sort-order.description'),
      options: sortOrderValues,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
    }),
    ignore: Flags.boolean({
      summary: messages.getMessage('flags.ignore.summary'),
      description: messages.getMessage('flags.ignore.description'),
    }),
    file: Flags.file({
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description', [IGNORE_FILE_NAME]),
      default: './' + IGNORE_FILE_NAME,
      helpValue: '<path/to/ignore/file>',
    }),
    'output-file': Flags.file({
      summary: generalMessages.getMessage('flags.output-file.summary'),
      description: generalMessages.getMessage('flags.output-file.description'),
      helpValue: '<path/to/output/file>',
    }),
  };

  public async run(): Promise<AnyJson> {
    const { flags } = await this.parse(AhMetadataLocalRepair);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (!flags.all && !flags.type) {
      throw new SfError(messages.getMessage('error.missing-types'));
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (flags.progress) {
      this.log(messages.getMessage(flags['only-check'] ? 'message.running-check' : 'message.running-repair'));
    } else {
      this.spinner.start(messages.getMessage(flags['only-check'] ? 'message.running-check' : 'message.running-repair'));
    }
    this.validateIgnoreFiles(flags);
    try {
      let types: { [key: string]: MetadataType } | undefined;
      if (flags.type && !flags.all) {
        types = CommandUtils.getAdvanceTypes(flags.type);
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
      const metadataDetails = await connector.listMetadataTypes();
      const manager = new DependenciesManager(flags.root, metadataDetails);
      manager
        .setTypesToRepair(types)
        .setCompress(flags.compress)
        .setSortOrder(flags['sort-order'])
        .setIgnoreFile(flags.ignore ? flags.file : undefined);
      manager.onStartObject((status: ProgressStatus) => {
        if (flags.progress) {
          if (flags.progress) {
            this.log(messages.getMessage('message.processing-object', [status.entityObject, status.entityType]));
          } else {
            this.spinner.status = messages.getMessage('message.processing-object', [
              status.entityObject,
              status.entityType,
            ]);
          }
        }
      });
      manager.onStartItem((status: ProgressStatus) => {
        if (flags.progress) {
          if (flags.progress) {
            this.log(
              messages.getMessage('message.processing-item', [
                status.entityItem,
                status.entityObject,
                status.entityType,
              ])
            );
          } else {
            this.spinner.status = messages.getMessage('message.processing-item', [
              status.entityItem,
              status.entityObject,
              status.entityType,
            ]);
          }
        }
      });
      let result: AnyJson;
      if (flags.onlycheck) {
        result = Utils.clone(manager.checkErrors()) as AnyJson;
      } else {
        result = Utils.clone(manager.repairDependencies()) as AnyJson;
      }
      if (flags['output-file']) {
        const baseDir = PathUtils.getDirname(flags['output-file']);
        if (!FileChecker.isExists(baseDir)) {
          FileWriter.createFolderSync(baseDir);
        }
        FileWriter.createFileSync(flags['output-file'], JSON.stringify(result, null, 2));
        if (flags.progress) {
          this.log(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
        } else {
          this.spinner.stop(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
        }
      }
      return result;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private validateIgnoreFiles(flags: Partial<AhMetadataLocalRepairFlags>): void {
    if (flags.ignore) {
      if (flags.progress) {
        this.log(messages.getMessage('message.validate-file'));
      } else {
        this.spinner.status = messages.getMessage('message.validate-file');
      }
      if (!flags.file) {
        flags.file = (flags.root ?? '') + '/' + IGNORE_FILE_NAME;
      }
      flags.file = CommandUtils.validateFilePath(flags.file, '--file');
      CommandUtils.validateJSONFile(flags.file, '--file');
    }
  }
}
