import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { CoreUtils, FileChecker, FileReader, FileWriter, PathUtils } from '@aurahelper/core';
import CommandUtils from '../../../../libs/utils/commandUtils';
import { QualityGate } from '../../../../libs/utils/codeScanValues';

const ProjectUtils = CoreUtils.ProjectUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.scan.report.quality');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhScanReportQuality extends SfCommand<QualityGate> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static enableJsonFlag = true;

  public static readonly flags = {
    root: Flags.directory({
      char: 'r',
      summary: generalMessages.getMessage('flags.root.summary'),
      description: generalMessages.getMessage('flags.root.description'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    interactive: Flags.boolean({
      char: 'i',
      summary: messages.getMessage('flags.interactive.summary'),
      description: messages.getMessage('flags.interactive.description'),
      default: true,
      required: false,
      allowNo: true,
    }),
    'max-debt': Flags.string({
      summary: messages.getMessage('flags.max-debt.summary'),
      description: messages.getMessage('flags.max-debt.description'),
      required: false,
      helpValue: '<1Y 1M 1W 1D 1h 1m>',
    }),
    'max-bugs': Flags.integer({
      summary: messages.getMessage('flags.max-bugs.summary'),
      description: messages.getMessage('flags.max-bugs.description'),
      required: false,
      helpValue: '<number>',
    }),
    'max-blockers': Flags.integer({
      summary: messages.getMessage('flags.max-blockers.summary'),
      description: messages.getMessage('flags.max-blockers.description'),
      required: false,
      helpValue: '<number>',
    }),
    'max-criticals': Flags.integer({
      summary: messages.getMessage('flags.max-criticals.summary'),
      description: messages.getMessage('flags.max-criticals.description'),
      required: false,
      helpValue: '<number>',
    }),
    'max-majors': Flags.integer({
      summary: messages.getMessage('flags.max-majors.summary'),
      description: messages.getMessage('flags.max-majors.description'),
      required: false,
      helpValue: '<number>',
    }),
    'max-minors': Flags.integer({
      summary: messages.getMessage('flags.max-minors.summary'),
      description: messages.getMessage('flags.max-minors.description'),
      required: false,
      helpValue: '<number>',
    }),
    'max-infos': Flags.integer({
      summary: messages.getMessage('flags.max-infos.summary'),
      description: messages.getMessage('flags.max-infos.description'),
      required: false,
      helpValue: '<number>',
    }),
  };

  public async run(): Promise<QualityGate> {
    const { flags } = await this.parse(AhScanReportQuality);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    let qualityGate = getCustomQualityGate(flags.root) ?? ({} as QualityGate);
    if (flags.interactive) {
      this.log(
        'Configuring Custom Quality Report to the selected project. Please enter the following values for the Quality Gate: '
      );
      this.log(
        '\t- Max Technical Debt: The maximum amount of technical debt that can be introduced in the project. Duration format like: 1d 3h 30m. Use Y or y for years, M for months, W or w for weeks, d or D for days, h or H for hours, m for minutes'
      );
      this.log('\t- Max Bugs: The maximum number of bugs that can be introduced in the project');
      this.log('\t- Max Blocker Issues: The maximum number of blocker issues that can be introduced in the project');
      this.log('\t- Max Critical Issues: The maximum number of critical issues that can be introduced in the project');
      this.log('\t- Max Major Issues: The maximum number of major issues that can be introduced in the project');
      this.log('\t- Max Minor Issues: The maximum number of minor issues that can be introduced in the project');
      this.log('\t- Max Info Issues: The maximum number of info issues that can be introduced in the project');
      AhScanReportQuality.enableJsonFlag = false;
      qualityGate = await this.runInteractive(qualityGate);
    } else {
      qualityGate.maxDebt = flags['max-debt'];
      qualityGate.maxBugs = flags['max-bugs'];
      qualityGate.maxBlockers = flags['max-blockers'];
      qualityGate.maxCriticals = flags['max-criticals'];
      qualityGate.maxMajors = flags['max-majors'];
      qualityGate.maxMinors = flags['max-minors'];
      qualityGate.maxInfos = flags['max-infos'];
    }
    saveCustomQualityGate(flags.root, qualityGate);
    if (!flags.json) {
      this.log('Quality Gate saved successfully');
    }
    return qualityGate;
  }

  private async runInteractive(qualityGate: QualityGate): Promise<QualityGate> {
    const maxDebt = await this.prompt<{ maxDebt: string }>({
      type: 'input',
      name: 'maxDebt',
      message: 'Max Technical Debt. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input) {
          const splits = value.input.split(' ');
          for (const split of splits) {
            if (split && !split.match(/^[0-9]+[yYmMdDhHwW]$/)) {
              return 'Please enter a valid duration format: xY xM xW xD xh xm';
            }
          }
        }
        return true;
      },
    });
    qualityGate.maxDebt = maxDebt.maxDebt ?? undefined;
    const maxBugs = await this.prompt<{ maxBugs: string }>({
      type: 'input',
      name: 'maxBugs',
      message: 'Max Bugs. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxBugs = maxBugs.maxBugs ? parseInt(maxBugs.maxBugs, 10) : undefined;
    const maxBlockers = await this.prompt<{ maxBlockers: string }>({
      type: 'input',
      name: 'maxBlockers',
      message: 'Max Blocker Issues. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxBlockers = maxBlockers.maxBlockers ? parseInt(maxBlockers.maxBlockers, 10) : undefined;
    const maxCriticals = await this.prompt<{ maxCriticals: string }>({
      type: 'input',
      name: 'maxCriticals',
      message: 'Max Critical Issues. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxCriticals = maxCriticals.maxCriticals ? parseInt(maxCriticals.maxCriticals, 10) : undefined;
    const maxMajors = await this.prompt<{ maxMajors: string }>({
      type: 'input',
      name: 'maxMajors',
      message: 'Max Major Issues. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxMajors = maxMajors.maxMajors ? parseInt(maxMajors.maxMajors, 10) : undefined;
    const maxMinors = await this.prompt<{ maxMinors: string }>({
      type: 'input',
      name: 'maxMinors',
      message: 'Max Minor Issues. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxMinors = maxMinors.maxMinors ? parseInt(maxMinors.maxMinors, 10) : undefined;
    const maxInfos = await this.prompt<{ maxInfos: string }>({
      type: 'input',
      name: 'maxInfos',
      message: 'Max Info Issues. Empty for no limit.',
      validate: (value: { input: string }) => {
        if (value.input && !value.input.match(/^[0-9]+$/)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    });
    qualityGate.maxInfos = maxInfos.maxInfos ? parseInt(maxInfos.maxInfos, 10) : undefined;
    return qualityGate;
  }
}

function getCustomQualityGate(root: string): QualityGate | undefined {
  const alias = ProjectUtils.getOrgAlias(root ?? '');
  const auraHelperFolder = PathUtils.getAuraHelperSFTempFilesPath();
  const filePath = `${auraHelperFolder}/QualityGates/${alias}.json`;
  if (FileChecker.isExists(filePath)) {
    const data = JSON.parse(FileReader.readFileSync(filePath)) as QualityGate;
    return data;
  }
  return undefined;
}

function saveCustomQualityGate(root: string, qualityGate: QualityGate): void {
  const alias = ProjectUtils.getOrgAlias(root ?? '');
  const auraHelperFolder = PathUtils.getAuraHelperSFTempFilesPath();
  const folderPath = `${auraHelperFolder}/QualityGates`;
  if (!FileChecker.isExists(folderPath)) {
    FileWriter.createFolderSync(folderPath);
  }
  const filePath = `${folderPath}/${alias}.json`;
  FileWriter.createFileSync(filePath, JSON.stringify(qualityGate));
}
