/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { FileChecker, FileReader, FileWriter, MetadataType } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.package.json.convert');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhPackageJsonConvertResult = {
  path: string;
  metadata: { [key: string]: MetadataType };
};

export default class AhPackageJsonConvert extends SfCommand<AhPackageJsonConvertResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'output-dir': Flags.directory({
      summary: generalMessages.getMessage('flags.output-dir.summary'),
      description: generalMessages.getMessage('flags.output-dir.description'),
      helpValue: '<path/to/output/file>',
      default: './',
    }),
    'input-file': Flags.file({
      summary: messages.getMessage('flags.input-file.summary'),
      description: messages.getMessage('flags.input-file.description'),
      helpValue: '<path/to/package/file>',
    }),
    filename: Flags.string({
      summary: generalMessages.getMessage('flags.filename.summary'),
      description: generalMessages.getMessage('flags.filename.description'),
    }),
    'save-result': Flags.boolean({
      summary: messages.getMessage('flags.save-result.summary'),
      description: messages.getMessage('flags.save-result.description'),
    }),
  };

  public async run(): Promise<AhPackageJsonConvertResult> {
    const { flags } = await this.parse(AhPackageJsonConvert);
    try {
      this.spinner.start('Converting package.xml to JSON Metadata Types format');
      flags['input-file'] = CommandUtils.validateFilePath(flags['input-file'] as string, '--input-file');
      if (flags['output-dir']) {
        flags['output-dir'] = CommandUtils.validateFolderPath(flags['output-dir'], '--output-dir');
      }
      const metadataTypes = MetadataFactory.createMetadataTypesFromPackageXML(
        FileReader.readFileSync(flags['input-file'])
      );
      let path = '';
      if (flags['save-result']) {
        if (!FileChecker.isExists(flags['output-dir'])) {
          FileWriter.createFolderSync(flags['output-dir']);
        }
        path =
          flags['ouput-dir'] ?? flags['output-dir'] + '/' + (flags.filename ?? `Package Types - ${Date.now()}.json`);
        FileWriter.createFileSync(path, JSON.stringify(metadataTypes, null, 2));
      }
      this.spinner.stop();
      return {
        path,
        metadata: metadataTypes,
      };
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }
}
