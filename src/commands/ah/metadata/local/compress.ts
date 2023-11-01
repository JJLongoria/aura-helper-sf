import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { CoreUtils, XMLCompressorStatus } from '@aurahelper/core';

import CommandUtils from '../../../../libs/utils/commandUtils';

const MathUtils = CoreUtils.MathUtils;
const Utils = CoreUtils.Utils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.local.compress');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];

export type AhMetadataLocalCompressResult = {
  message: string;
  totalFiles: number;
  compressed: number;
  failed: number;
};

export default class AhMetadataLocalCompress extends SfCommand<AhMetadataLocalCompressResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['ah:compress', 'ah:xml:compress', 'ah:compress:xml'];

  public static readonly flags = {
    root: Flags.directory({
      char: 'r',
      summary: generalMessages.getMessage('flags.root.summary'),
      description: generalMessages.getMessage('flags.root.description'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    all: Flags.boolean({
      summary: messages.getMessage('flags.all.summary'),
      description: messages.getMessage('flags.all.description'),
      exclusive: ['file', 'directory'],
    }),
    file: Flags.string({
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description'),
      char: 'f',
      exclusive: ['all', 'directory'],
      helpValue: '<path/to/file>',
      multiple: true,
    }),
    directory: Flags.string({
      summary: messages.getMessage('flags.directory.summary'),
      description: messages.getMessage('flags.directory.description'),
      char: 'd',
      exclusive: ['all', 'file'],
      helpValue: '<path/to/directory>',
      multiple: true,
    }),
    'sort-order': Flags.string({
      summary: generalMessages.getMessage('flags.sort-order.summary'),
      description: generalMessages.getMessage('flags.sort-order.description'),
      options: sortOrderValues,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
    }),
  };

  public async run(): Promise<AhMetadataLocalCompressResult> {
    const { flags } = await this.parse(AhMetadataLocalCompress);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (!flags.all && !flags.directory && !flags.file) {
      throw new SfError(messages.getMessage('error.missing-compress-target'));
    }
    const compressor = new XMLCompressor();
    compressor.setSortOrder(flags['sort-order']);
    if (flags.all || flags.directory) {
      const param = flags.all ? '--root' : '--directory';
      try {
        const paths: string[] = flags.all
          ? CommandUtils.getProjectPaths(flags.root, flags.root, true)
          : CommandUtils.getProjectPaths(flags.directory as string[], flags.root, true);
        compressor.addPaths(paths);
      } catch (error) {
        const err = error as Error;
        throw new SfError(generalMessages.getMessage('error.wrong-directory', [param, err.message]));
      }
    } else {
      try {
        flags.file = CommandUtils.getProjectPaths(Utils.forceArray<string>(flags.file), flags.root);
      } catch (error) {
        const err = error as Error;
        throw new SfError(generalMessages.getMessage('error.wrong-file', ['--file', err.message]));
      }
      compressor.addPaths(flags.file);
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.compress-progress'));
    }
    let totalFiles = 0;
    let compressed = 0;
    let failed = 0;
    compressor.onCompressFailed((status: XMLCompressorStatus) => {
      const percentage = MathUtils.round((status.filesProcessed / status.totalFiles) * 100, 2);
      totalFiles = status.totalFiles;
      failed++;
      if (flags.progress) {
        this.log(messages.getMessage('message.file-not-compressed', [status.file, percentage]));
      } else {
        this.spinner.status = messages.getMessage('message.compress-percentage', [percentage]);
      }
    });
    compressor.onCompressSuccess((status: XMLCompressorStatus) => {
      const percentage = MathUtils.round((status.filesProcessed / status.totalFiles) * 100, 2);
      totalFiles = status.totalFiles;
      compressed++;
      if (flags.progress) {
        this.log(messages.getMessage('message.file-compressed', [status.file, percentage]));
      } else {
        this.spinner.status = messages.getMessage('message.compress-percentage', [percentage]);
      }
    });
    try {
      await compressor.compress();
      if (!flags.progress) {
        this.spinner.stop(messages.getMessage('message.compress-success'));
      } else {
        this.log(messages.getMessage('message.compress-success'));
      }
      return {
        message: messages.getMessage('message.compress-success'),
        totalFiles,
        compressed,
        failed,
      };
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }
}
