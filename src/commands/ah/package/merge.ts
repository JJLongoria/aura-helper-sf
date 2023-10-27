/* eslint-disable class-methods-use-this */
/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { PackageGeneratorResult } from '@aurahelper/core';
import { PackageGenerator } from '@aurahelper/package-generator';
import { ProjectUtils } from '@aurahelper/core/dist/utils';

import CommandUtils from '../../../libs/utils/commandUtils';

export interface AhPackageMergeFlags {
  root: string;
  'api-version': string;
  progress: boolean;
  file: string[];
  'delete-before': boolean;
  ignore: boolean;
  'ignore-file': string;
  'ignore-destructive': boolean;
  'ignore-destructive-file': string;
  'output-path': string;
  strategy: string;
}

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.package.merge');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const IGNORE_FILE_NAME = '.ahignore.json';

export default class AhPackageMerge extends SfCommand<PackageGeneratorResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['ah:merge:package'];

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
    file: Flags.file({
      char: 'f',
      summary: messages.getMessage('flags.file.summary'),
      description: messages.getMessage('flags.file.description'),
      multiple: true,
      required: true,
    }),
    'delete-before': Flags.boolean({
      char: 'b',
      summary: messages.getMessage('flags.delete-before.summary'),
      description: messages.getMessage('flags.delete-before.description'),
    }),
    ignore: Flags.boolean({
      summary: messages.getMessage('flags.ignore.summary'),
      description: messages.getMessage('flags.ignore.description'),
    }),
    'ignore-file': Flags.file({
      summary: messages.getMessage('flags.ignore-file.summary'),
      description: messages.getMessage('flags.ignore-file.description', [IGNORE_FILE_NAME]),
      default: './' + IGNORE_FILE_NAME,
      helpValue: '<path/to/ignore/file>',
    }),
    'ignore-destructive': Flags.boolean({
      summary: messages.getMessage('flags.ignore-destructive.summary'),
      description: messages.getMessage('flags.ignore-destructive.description'),
    }),
    'ignore-destructive-file': Flags.file({
      summary: messages.getMessage('flags.ignore-destructive-file.summary'),
      description: messages.getMessage('flags.ignore-destructive-file.description', [IGNORE_FILE_NAME]),
      default: './' + IGNORE_FILE_NAME,
      helpValue: '<path/to/ignore/file>',
    }),
    'output-path': Flags.directory({
      summary: messages.getMessage('flags.output-path.summary'),
      description: messages.getMessage('flags.output-path.description'),
      helpValue: '<path/to/output/file>',
      default: './',
    }),
    strategy: Flags.string({
      summary: messages.getMessage('flags.strategy.summary'),
      description: messages.getMessage('flags.strategy.description'),
      options: [
        'by-type',
        'BY-TYPE',
        'b',
        'B',
        'only-package',
        'ONLY-PACKAGE',
        'p',
        'P',
        'only-destructive',
        'ONLY-DESTRUCTIVE',
        'd',
        'D',
        'full-package',
        'FULL-PACKAGE',
        'fp',
        'FP',
        'full-destructive',
        'FULL-DESTRUCTIVE',
        'fd',
        'FD',
      ],
      default: 'by-type',
      required: false,
      helpValue: '<strategy>',
    }),
  };

  // eslint-disable-next-line sf-plugin/no-classes-in-command-return-type
  public async run(): Promise<PackageGeneratorResult> {
    const { flags } = await this.parse(AhPackageMerge);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (flags['output-path']) {
      flags['output-path'] = CommandUtils.validateFolderPath(flags['output-path'], '--output-path');
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.runnig-merge'));
    } else {
      this.spinner.start(messages.getMessage('message.runnig-merge'));
    }
    this.validateIgnoreFiles(flags);
    try {
      flags.file = CommandUtils.getPaths(flags.file, '--file');
      if (flags.file.length < 2) {
        throw new SfError(messages.getMessage('error.missing-data'));
      }
      const result = this.createPackages(flags);
      return result;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private createPackages(flags: Partial<AhPackageMergeFlags>): PackageGeneratorResult {
    let result = new PackageGeneratorResult();
    const packageGenerator = new PackageGenerator(
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root ?? '')?.sourceApiVersion
    );
    if (flags.ignore) {
      packageGenerator.setIgnoreFile(flags['ignore-file'] ?? '');
    }
    if (flags['ignore-destructive'] && flags['ignore-destructive-file']) {
      packageGenerator.setDestructiveIgnoreFile(flags['ignore-destructive-file'] ?? '');
    }
    packageGenerator.setBeforeDeploy(flags['delete-before']);
    const outputPath = flags['output-path'] ?? '';
    const files = flags.file ?? [];
    if (this.byTypeStrategy(flags)) {
      packageGenerator.setMergePackagesFiles().setMergeDestructives();
      result = packageGenerator.mergePackages(files, outputPath);
    } else if (this.onlyPackageStrategy(flags)) {
      packageGenerator.setMergePackagesFiles();
      result = packageGenerator.mergePackages(files, outputPath);
    } else if (this.onlyDestructiveStrategy(flags)) {
      packageGenerator.setMergeDestructives();
      result = packageGenerator.mergePackages(files, outputPath);
    } else if (this.fullPackageStrategy(flags)) {
      result = packageGenerator.mergePackagesFull(files, outputPath);
    } else if (this.fullDestructiveStrategy(flags)) {
      packageGenerator.setIsDestructive();
      result = packageGenerator.mergePackagesFull(files, outputPath);
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.files-created', [outputPath]));
    } else {
      this.spinner.stop(messages.getMessage('message.files-created', [outputPath]));
    }
    return result;
  }

  private byTypeStrategy(flags: Partial<AhPackageMergeFlags>): boolean {
    return (
      flags.strategy === 'by-type' || flags.strategy === 'BY-TYPE' || flags.strategy === 'b' || flags.strategy === 'B'
    );
  }

  private onlyPackageStrategy(flags: Partial<AhPackageMergeFlags>): boolean {
    return (
      flags.strategy === 'only-package' ||
      flags.strategy === 'ONLY-PACKAGE' ||
      flags.strategy === 'p' ||
      flags.strategy === 'P'
    );
  }

  private onlyDestructiveStrategy(flags: Partial<AhPackageMergeFlags>): boolean {
    return (
      flags.strategy === 'only-destructive' ||
      flags.strategy === 'ONLY-DESTRUCTIVE' ||
      flags.strategy === 'd' ||
      flags.strategy === 'D'
    );
  }

  private fullPackageStrategy(flags: Partial<AhPackageMergeFlags>): boolean {
    return (
      flags.strategy === 'full-package' ||
      flags.strategy === 'FULL-PACKAGE' ||
      flags.strategy === 'fp' ||
      flags.strategy === 'FP'
    );
  }

  private fullDestructiveStrategy(flags: Partial<AhPackageMergeFlags>): boolean {
    return (
      flags.strategy === 'full-destructive' ||
      flags.strategy === 'FULL-DESTRUCTIVE' ||
      flags.strategy === 'fd' ||
      flags.strategy === 'FD'
    );
  }

  private validateIgnoreFiles(flags: Partial<AhPackageMergeFlags>): void {
    if (flags.ignore || flags['ignore-destructive']) {
      if (flags.progress) {
        this.log(messages.getMessage('message.validate-ignore'));
      } else {
        this.spinner.status = messages.getMessage('message.validate-ignore');
      }
    }
    if (flags.ignore) {
      if (!flags['ignore-file']) {
        flags['ignore-file'] = (flags.root ?? '') + '/' + IGNORE_FILE_NAME;
      }
      flags['ignore-file'] = CommandUtils.validateFilePath(flags['ignore-file'], '--file');
      CommandUtils.validateJSONFile(flags['ignore-file'], '--file');
    }
    if (flags['ignore-destructive'] && !flags['ignore-destructive-file']) {
      flags['ignore-destructive-file'] = (flags.root ?? '') + '/' + IGNORE_FILE_NAME;
    } else if (flags['ignore-destructive-file']) {
      flags['ignore-destructive-file'] = CommandUtils.validateFilePath(
        flags['ignore-destructive-file'],
        '--ignore-destructive-file'
      );
      CommandUtils.validateJSONFile(flags['ignore-destructive-file'], '--ignore-destructive-file');
    }
  }
}
