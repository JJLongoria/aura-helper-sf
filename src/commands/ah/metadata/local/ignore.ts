/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import * as IgnoreLib from '@aurahelper/ignore';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';

import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.local.ignore');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const IGNORE_FILE_NAME = '.ahignore.json';
const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];

const MetadataIgnore = IgnoreLib.Ignore;

export type AhMetadataLocalIgnoreResult = {
  message: string;
};

export default class AhMetadataLocalIgnore extends SfCommand<AhMetadataLocalIgnoreResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:ignore:local:metadata',
    'ah:ignore:metadata:local',
    'ah:metadata:ignore:local',
    'ah:local:metadata:ignore',
    'ah:local:ignore:metadata',
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
    }),
    file: Flags.file({
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description', [IGNORE_FILE_NAME]),
      default: './' + IGNORE_FILE_NAME,
      helpValue: '<path/to/ignore/file>',
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
  };

  public async run(): Promise<AhMetadataLocalIgnoreResult> {
    const { flags } = await this.parse(AhMetadataLocalIgnore);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (!flags.all && !flags.type) {
      throw new SfError(messages.getMessage('error.missing-types'));
    }
    if (!flags.file) {
      flags.file = flags.root + '/' + IGNORE_FILE_NAME;
    }
    flags.file = CommandUtils.validateFilePath(flags.file, '--file');
    CommandUtils.validateJSONFile(flags.file, '--file');
    const types = flags.type ? CommandUtils.getTypes(flags.type) : undefined;
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-ignore'));
    } else {
      this.log(messages.getMessage('message.running-ignore'));
    }
    const alias = ProjectUtils.getOrgAlias(flags.root);
    const namespace = ProjectUtils.getOrgNamespace(flags.root);
    const connector = new SFConnector(
      alias,
      ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      namespace
    );
    if (flags.progress) {
      this.log(generalMessages.getMessage('message.getting-available-types'));
    } else {
      this.spinner.status = generalMessages.getMessage('message.getting-available-types');
    }
    connector.setMultiThread();
    try {
      const metadataDetails = await connector.listMetadataTypes();
      const ignore = new MetadataIgnore(flags.file);
      ignore.setCompress(flags.compress).setSortOrder(flags['sort-order']).setTypesToIgnore(types);
      ignore.onStartProcessType((metadataTypeName) => {
        if (flags.progress) {
          this.log(messages.getMessage('message.processing-metadata-type', [metadataTypeName]));
        } else {
          this.spinner.status = messages.getMessage('message.processing-metadata-type', [metadataTypeName]);
        }
      });
      ignore.ignoreProjectMetadata(flags.root, metadataDetails);
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.ignore-sucess'));
    } else {
      this.spinner.stop(messages.getMessage('message.ignore-sucess'));
    }
    return {
      message: messages.getMessage('message.ignore-sucess'),
    };
  }
}
