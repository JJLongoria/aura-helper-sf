import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { LiveServerParams, start, shutdown } from 'live-server';
import { FileReader } from '@aurahelper/core';

import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.scan.report.open');

export type AhScanReportOpenResult = {
  path: string;
};

export default class AhScanReportOpen extends SfCommand<string> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static enableJsonFlag = false;

  public static readonly flags = {
    'input-dir': Flags.directory({
      char: 'i',
      summary: messages.getMessage('flags.input-dir.summary'),
      description: messages.getMessage('flags.input-dir.description'),
      required: false,
      helpValue: '<path/to/report/directory>',
      default: './',
    }),
    port: Flags.integer({
      char: 'p',
      summary: messages.getMessage('flags.port.summary'),
      description: messages.getMessage('flags.port.description'),
      required: false,
      helpValue: '<port>',
      default: 5000,
    }),
  };

  public async run(): Promise<string> {
    const { flags } = await this.parse(AhScanReportOpen);
    this.spinner.start(messages.getMessage('message.open-report'));
    flags['input-dir'] = CommandUtils.validateFolderPath(flags['input-dir'], '--input-dir');
    const files = FileReader.readDirSync(flags['input-dir']);
    if (!files.includes('index.html')) {
      messages.createError('error.no-index', [flags['input-dir']]);
    }
    const params: LiveServerParams = {
      port: flags.port, // Set the server port. Defaults to 8080.
      host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
      root: flags['input-dir'], // Set root directory that's being served. Defaults to cwd.
      open: true, // When false, it won't load your browser by default.
      file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
      logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    };
    try {
      this.spinner.status = messages.getMessage('message.open-server');
      start(params);
      this.spinner.status = messages.getMessage('message.open-browser');
      shutdown();
    } catch (error) {
      /* empty */
    }
    this.spinner.stop(messages.getMessage('message.report-closed'));
    return messages.getMessage('message.report-closed');
  }
}
