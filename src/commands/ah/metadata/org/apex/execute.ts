/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';
import CommandUtils from '../../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.apex.execute');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhMetadataOrgApexExecuteResult = {
  message: string;
};

export default class AhMetadataOrgApexExecute extends SfCommand<AhMetadataOrgApexExecuteResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:metadata:execute:org:apex',
    'ah:metadata:apex:org:execute',
    'ah:metadata:org:execute:apex',
    'ah:org:metadata:apex:execute',
    'ah:org:execute:metadata:apex',
    'ah:org:apex:metadata:execute',
    'ah:org:apex:execute:metadata',
    'ah:apex:metadata:execute:org',
    'ah:apex:metadata:org:execute',
    'ah:apex:execute:org:metadata',
    'ah:apex:org:metadata:execute',
    'ah:apex:org:execute:metadata',
    'ah:execute:apex:metadata:org',
    'ah:execute:apex:org:metadata',
    'ah:execute:metadata:apex:org',
    'ah:execute:org:apex:metadata',
    'ah:execute:metadata:org:apex',
    'ah:execute:org:apex',
    'ah:execute:apex:org',
    'ah:apex:execute:org',
    'ah:apex:org:execute',
    'ah:org:execute:apex',
    'ah:org:apex:execute',
    'ah:apex:execute',
    'ah:execute:apex',
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
    file: Flags.file({
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description'),
      helpValue: '<path/to/apex/file>',
      required: true,
    }),
    iterations: Flags.integer({
      char: 'i',
      summary: messages.getMessage('flags.iterations.summary'),
      description: messages.getMessage('flags.iterations.description'),
      default: 1,
      min: 1,
    }),
    'print-log': Flags.boolean({
      char: 'l',
      summary: messages.getMessage('flags.print-log.summary'),
      description: messages.getMessage('flags.print-log.description'),
      dependsOn: ['progress'],
    }),
  };

  public async run(): Promise<AhMetadataOrgApexExecuteResult> {
    const { flags } = await this.parse(AhMetadataOrgApexExecute);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    flags.file = CommandUtils.validateFilePath(flags.file, '--file');
    if (flags.progress) {
      this.log(messages.getMessage('message.executing-script'));
    } else {
      this.spinner.start(messages.getMessage('message.executing-script'));
    }
    try {
      const alias = flags['target-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
      const namespace = ProjectUtils.getOrgNamespace(flags.root);
      const connector = new SFConnector(
        alias,
        flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
        flags.root,
        namespace
      );
      connector.setMultiThread();
      for (let i = 0; i < flags.iterations; i++) {
        if (flags.progress) {
          this.log(messages.getMessage('message.executing-iteration', [i + 1, flags.iterations]));
        } else {
          this.spinner.status = messages.getMessage('message.executing-iteration', [i + 1, flags.iterations]);
        }
        // eslint-disable-next-line no-await-in-loop
        const result = await connector.executeApexAnonymous(flags.file);
        if (flags.progress) {
          this.log(messages.getMessage('message.finished-iteration', [i + 1, flags.iterations]));
        } else {
          this.spinner.status = messages.getMessage('message.finished-iteration', [i + 1, flags.iterations]);
        }
        if (flags.progress && flags['print-log']) {
          this.log(result);
        }
      }
      if (flags.progress) {
        this.log(messages.getMessage('message.finished-script'));
      } else {
        this.spinner.stop(messages.getMessage('message.finished-script'));
      }
      return {
        message: messages.getMessage('message.finished-script'),
      };
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }
}
