/* eslint-disable sf-plugin/no-classes-in-command-return-type */
/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { MetadataType, PackageGeneratorResult } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import { ProjectUtils, Validator } from '@aurahelper/core/dist/utils';
import { Ignore } from '@aurahelper/ignore';
import { PackageGenerator } from '@aurahelper/package-generator';

import CommandUtils from '../../../../libs/utils/commandUtils';

export interface AhPackageJSONCreateFlags {
  root?: string;
  'api-version'?: string;
  progress?: boolean;
  source?: string;
  ignore?: boolean;
  'ignore-file'?: string;
  'delete-before'?: boolean;
  'to-delete'?: boolean;
  wildcards?: boolean;
  'output-path'?: string;
}

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.package.json.create');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const DESTRUCT_BEFORE_FILENAME = 'destructiveChanges.xml';
const DESTRUCT_AFTER_FILENAME = 'destructiveChangesPost.xml';
const PACKAGE_FILENAME = 'package.xml';
const IGNORE_FILE_NAME = '.ahignore.json';

export default class AhPackageJsonCreate extends SfCommand<PackageGeneratorResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:create:json:package',
    'ah:create:package:json',
    'ah:json:create:package',
    'ah:json:package:create',
    'ah:package:create:json',
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
    source: Flags.string({
      char: 's',
      summary: messages.getMessage('flags.source.summary'),
      description: messages.getMessage('flags.source.description'),
      helpValue: '<path/to/metadata/json>',
      required: true,
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
    'delete-before': Flags.boolean({
      char: 'b',
      summary: messages.getMessage('flags.delete-before.summary'),
      description: messages.getMessage('flags.delete-before.description'),
    }),
    'to-delete': Flags.boolean({
      char: 'd',
      summary: messages.getMessage('flags.to-delete.summary'),
      description: messages.getMessage('flags.to-delete.description'),
    }),
    wildcards: Flags.boolean({
      char: 'w',
      summary: messages.getMessage('flags.wildcards.summary'),
      description: messages.getMessage('flags.wildcards.description'),
    }),
    'output-path': Flags.directory({
      summary: messages.getMessage('flags.output-path.summary'),
      description: messages.getMessage('flags.output-path.description'),
      helpValue: '<path/to/output/file>',
      default: './',
    }),
  };

  public async run(): Promise<PackageGeneratorResult> {
    const { flags } = await this.parse(AhPackageJsonCreate);
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (flags['output-path']) {
      flags['output-path'] = CommandUtils.validateFolderPath(flags['output-path'], '--output-path');
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.running-crate-package'));
    } else {
      this.spinner.start(messages.getMessage('message.running-crate-package'));
    }
    this.validateIgnoreFiles(flags);
    flags.source = CommandUtils.validateFilePath(flags.source, '--source');
    try {
      if (flags.progress) {
        this.log(messages.getMessage('message.reading-json'));
      } else {
        this.spinner.status = messages.getMessage('message.reading-json');
      }
      let metadataTypes = MetadataFactory.deserializeMetadataTypes(Validator.validateMetadataJSON(flags.source));
      if (flags.ignore) {
        if (flags.progress) {
          this.log(messages.getMessage('message.validate-ignore'));
        } else {
          this.spinner.status = messages.getMessage('message.validate-ignore');
        }
        metadataTypes = new Ignore(flags['ignore-file']).ignoreMetadata(metadataTypes);
      }
      return this.createPackages(flags, metadataTypes);
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private createPackages(
    flags: Partial<AhPackageJSONCreateFlags>,
    metadataTypes: { [key: string]: MetadataType }
  ): PackageGeneratorResult {
    const result = new PackageGeneratorResult();
    const root = flags.root ?? '';
    const outputpath = flags['output-path'] ?? '';
    const packageGenerator = new PackageGenerator(
      flags['api-version'] ?? ProjectUtils.getProjectConfig(root)?.sourceApiVersion
    ).setExplicit();
    if (!flags['to-delete']) {
      if (flags.progress) {
        this.log(messages.getMessage('message.creating-file', [PACKAGE_FILENAME]));
      } else {
        this.spinner.status = messages.getMessage('message.creating-file', [PACKAGE_FILENAME]);
      }
      result.package = packageGenerator.createPackage(metadataTypes, outputpath);
    } else if (flags['delete-before']) {
      if (flags.progress) {
        this.log(messages.getMessage('message.creating-file', [DESTRUCT_BEFORE_FILENAME]));
      } else {
        this.spinner.status = messages.getMessage('message.creating-file', [DESTRUCT_BEFORE_FILENAME]);
      }
      result.destructiveChanges = packageGenerator.createBeforeDeployDestructive(metadataTypes, outputpath);
    } else {
      if (flags.progress) {
        this.log(messages.getMessage('message.creating-file', [DESTRUCT_AFTER_FILENAME]));
      } else {
        this.spinner.status = messages.getMessage('message.creating-file', [DESTRUCT_AFTER_FILENAME]);
      }
      result.destructiveChangesPost = packageGenerator.createAfterDeployDestructive(metadataTypes, outputpath);
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.file-created', [outputpath]));
    } else {
      this.spinner.stop(messages.getMessage('message.file-created', [outputpath]));
    }
    return result;
  }

  private validateIgnoreFiles(flags: Partial<AhPackageJSONCreateFlags>): void {
    if (flags.ignore) {
      if (flags.progress) {
        this.log(messages.getMessage('message.validate-ignore'));
      } else {
        this.spinner.status = messages.getMessage('message.validate-ignore');
      }
      if (!flags['ignore-file']) {
        flags['ignore-file'] = (flags.root ?? '') + '/' + IGNORE_FILE_NAME;
      }
      flags['ignore-file'] = CommandUtils.validateFilePath(flags['ignore-file'], '--file');
      CommandUtils.validateJSONFile(flags['ignore-file'], '--file');
    }
  }
}
