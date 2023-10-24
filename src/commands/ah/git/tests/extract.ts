import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { GitManager } from '@aurahelper/git-manager';
import { CoreUtils } from '@aurahelper/core';
import CommandUtils from '../../../../libs/utils/commandUtils';

const StrUtils = CoreUtils.StrUtils;
let gitManager: GitManager;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.git.tests.extract');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

/* eslint-disable sf-plugin/no-unnecessary-aliases */
export default class AhGitTestsExtract extends SfCommand<string | string[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['ah:extract:git:test', 'ah:git:extract:test'];

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
    'output-file': Flags.file({
      summary: generalMessages.getMessage('flags.output-file.summary'),
      description: generalMessages.getMessage('flags.output-file.description'),
      helpValue: '<path/to/output/file>',
      default: './export',
    }),
    source: Flags.string({
      summary: messages.getMessage('flags.source.summary'),
      description: messages.getMessage('flags.source.description'),
      char: 's',
      required: true,
    }),
    target: Flags.string({
      summary: messages.getMessage('flags.target.summary'),
      description: messages.getMessage('flags.target.description'),
      char: 't',
    }),
    'start-tag': Flags.string({
      summary: messages.getMessage('flags.start-tag.summary'),
      description: messages.getMessage('flags.start-tag.description'),
      default: '--TESTS START--',
    }),
    'end-tag': Flags.string({
      summary: messages.getMessage('flags.end-tag.summary'),
      description: messages.getMessage('flags.end-tag.description'),
      default: '--TESTS END--',
    }),
  };

  public async run(): Promise<string | string[]> {
    const { flags } = await this.parse(AhGitTestsExtract);
    let testClassesResult: string[] = [];
    flags.root = CommandUtils.validateProjectPath();
    flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    try {
      gitManager = new GitManager(flags.root);
      const gitCommits = await gitManager.getCommits(flags.source, flags.target);
      if (gitCommits?.length) {
        for (const commit of gitCommits) {
          if (commit.message) {
            const splits = commit.message.split('\n');
            let onTests = false;
            for (const split of splits) {
              if (onTests) {
                let data = StrUtils.replace(split, flags['start-tag'], '').trim();
                data = StrUtils.replace(data, flags['end-tag'], '').trim();
                if (data) {
                  if (StrUtils.contains(data, ',')) {
                    for (let dataSplit of data.split(',')) {
                      dataSplit = dataSplit.trim();
                      if (dataSplit && !testClassesResult.includes(dataSplit)) {
                        testClassesResult.push(dataSplit);
                      }
                    }
                  } else if (!testClassesResult.includes(data)) {
                    testClassesResult.push(data);
                  }
                }
              }
              if (onTests && StrUtils.contains(split, flags['end-tag'])) {
                onTests = false;
              }
              if (!onTests && StrUtils.contains(split, flags['start-tag'])) {
                onTests = true;
              }
            }
          }
        }
      }
      testClassesResult = testClassesResult.sort((a: string, b: string) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      if (!flags.json) {
        this.log(testClassesResult.join(','));
      }
      return testClassesResult;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }
}
