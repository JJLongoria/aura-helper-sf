import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.logs.clean');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhLogsCleanResult = {
  totalLogs: number;
};

export default class AhLogsClean extends SfCommand<AhLogsCleanResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg({
      char: 'o',
      description: generalMessages.getMessage('flags.target-org.description'),
      summary: generalMessages.getMessage('flags.target-org.summary'),
      required: true,
    }),
    'api-version': Flags.orgApiVersion({
      char: 'a',
      summary: generalMessages.getMessage('flags.api-version.summary'),
      description: generalMessages.getMessage('flags.api-version.description'),
    }),
  };

  public async run(): Promise<AhLogsCleanResult> {
    const { flags } = await this.parse(AhLogsClean);
    const org = flags['target-org'];
    const connection = org.getConnection(flags['api-version']);
    const results = await connection.tooling.query('Select Id from ApexLog');
    try {
      await connection.bulk.load('ApexLog', 'delete', {}, results?.records);
    } catch (error) {
      this.logJson(error);
    }
    return {
      totalLogs: results?.records.length ?? 0,
    };
  }
}
