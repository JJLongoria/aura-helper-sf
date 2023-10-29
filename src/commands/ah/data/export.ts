import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { ExportTreeDataResult } from '@aurahelper/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';
import CommandUtils from '../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.data.export');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhDataExport extends SfCommand<ExportTreeDataResult[]> {
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
    query: Flags.string({
      char: 'q',
      summary: messages.getMessage('flags.query.summary'),
      description: messages.getMessage('flags.query.description'),
      helpValue: 'Select ... from ...',
      required: true,
    }),
    'output-dir': Flags.directory({
      summary: messages.getMessage('flags.output-dir.summary'),
      description: messages.getMessage('flags.output-dir.description'),
      helpValue: '<path/to/output/file>',
      default: './export',
    }),
    prefix: Flags.string({
      summary: messages.getMessage('flags.prefix.summary'),
      description: messages.getMessage('flags.prefix.description'),
      helpValue: '<filePrefix>',
    }),
  };

  public async run(): Promise<ExportTreeDataResult[]> {
    const { flags } = await this.parse(AhDataExport);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    flags['output-dir'] = CommandUtils.validateFolderPath(flags['output-dir'], 'output-dir');
    try {
      if (!flags.progress) {
        this.spinner.start(messages.getMessage('message.running-export'));
      }
      const alias = flags['target-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
      const extractigFrom = flags['target-org'] ? 'Org with username or alias ' + alias : 'Auth org';
      if (flags.progress) {
        this.log(messages.getMessage('message.start-extracting-data', [extractigFrom]));
      } else {
        this.spinner.status = messages.getMessage('message.start-extracting-data', [extractigFrom]);
      }
      const namespace = ProjectUtils.getOrgNamespace(flags.root);
      const connector = new SFConnector(
        alias,
        flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
        flags.root,
        namespace
      );
      connector.setMultiThread();
      const response = await connector.exportTreeData(flags.query, flags['output-dir'], flags.prefix);
      if (flags.progress) {
        this.log(messages.getMessage('message.extracted-data-success', [flags['output-dir']]));
      } else {
        this.spinner.stop(messages.getMessage('message.extracted-data-success', [flags['output-dir']]));
      }
      return response;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }
}
