/* eslint-disable class-methods-use-this */
/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import {
  GitDiff,
  MetadataObject,
  MetadataType,
  MetadataTypes,
  PackageGeneratorResult,
  TypesFromGit,
} from '@aurahelper/core';
import { GitManager } from '@aurahelper/git-manager';
import { PackageGenerator } from '@aurahelper/package-generator';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { Ignore } from '@aurahelper/ignore';
import { SFConnector } from '@aurahelper/connector';
import { MetadataFactory } from '@aurahelper/metadata-factory';

import CommandUtils from '../../../../libs/utils/commandUtils';

export interface AhPackageGitCreateFlags {
  root: string;
  'api-version': string;
  progress: boolean;
  type: string;
  source: string;
  target: string;
  raw: boolean;
  ignore: boolean;
  'ignore-file': string;
  'ignore-destructive': boolean;
  'ignore-destructive-file': string;
  'output-path': string;
  'delete-before': boolean;
}

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.package.git.create');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const DESTRUCT_BEFORE_FILENAME = 'destructiveChanges.xml';
const DESTRUCT_AFTER_FILENAME = 'destructiveChangesPost.xml';
const PACKAGE_FILENAME = 'package.xml';
const IGNORE_FILE_NAME = '.ahignore.json';
let gitManager: GitManager;

export default class AhPackageGitCreate extends SfCommand<TypesFromGit | PackageGeneratorResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:create:git:package',
    'ah:create:package:git',
    'ah:git:create:package',
    'ah:git:package:create',
    'ah:package:create:git',
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
    type: Flags.string({
      summary: messages.getMessage('flags.type.summary'),
      description: messages.getMessage('flags.type.description'),
      default: 'both',
      options: ['package', 'PACKAGE', 'p', 'P', 'destructive', 'DESTRUCTIVE', 'd', 'D', 'both', 'BOTH', 'b', 'B'],
      helpValue: '<fileTypeValue>',
    }),
    source: Flags.string({
      char: 's',
      summary: messages.getMessage('flags.source.summary'),
      description: messages.getMessage('flags.source.description'),
    }),
    target: Flags.string({
      char: 't',
      summary: messages.getMessage('flags.target.summary'),
      description: messages.getMessage('flags.target.description'),
    }),
    raw: Flags.boolean({
      summary: messages.getMessage('flags.raw.summary'),
      description: messages.getMessage('flags.raw.description'),
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
    'delete-before': Flags.boolean({
      char: 'b',
      summary: messages.getMessage('flags.delete-before.summary'),
      description: messages.getMessage('flags.delete-before.description'),
    }),
  };

  public async run(): Promise<TypesFromGit | PackageGeneratorResult> {
    const { flags } = await this.parse(AhPackageGitCreate);
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
    try {
      gitManager = new GitManager(flags.root);
      if (!flags.source || flags.source === 'this') {
        flags.source = await this.getActiveBranch(flags);
      }
      const gitDiffs = await this.getGitDiffs(flags);
      let typesFromGit = await this.analyzeGitDiffs(flags, gitDiffs);
      if (flags.ignore) {
        typesFromGit = await this.ignoreMetadata(flags, typesFromGit);
      }
      this.fixTypes(typesFromGit);
      if (flags.json && flags.raw) {
        return typesFromGit;
      } else {
        return this.createPackages(flags, typesFromGit);
      }
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private fixTypes(typesFromGit: TypesFromGit): void {
    const typesToFix: { [key: string]: string } = {};
    typesToFix[MetadataTypes.SHARING_CRITERIA_RULE] = MetadataTypes.SHARING_RULES;
    typesToFix[MetadataTypes.SHARING_OWNER_RULE] = MetadataTypes.SHARING_RULES;
    typesToFix[MetadataTypes.SHARING_GUEST_RULE] = MetadataTypes.SHARING_RULES;
    typesToFix[MetadataTypes.SHARING_TERRITORY_RULE] = MetadataTypes.SHARING_RULES;
    typesToFix[MetadataTypes.WORKFLOW_OUTBOUND_MESSAGE] = MetadataTypes.WORKFLOW;
    typesToFix[MetadataTypes.WORKFLOW_KNOWLEDGE_PUBLISH] = MetadataTypes.WORKFLOW;
    typesToFix[MetadataTypes.WORKFLOW_TASK] = MetadataTypes.WORKFLOW;
    typesToFix[MetadataTypes.WORKFLOW_RULE] = MetadataTypes.WORKFLOW;
    typesToFix[MetadataTypes.WORKFLOW_FIELD_UPDATE] = MetadataTypes.WORKFLOW;
    typesToFix[MetadataTypes.WORKFLOW_ALERT] = MetadataTypes.WORKFLOW;
    if (typesFromGit.toDeploy) {
      const typesToAdd: string[] = [];
      for (const mtKey of Object.keys(typesToFix)) {
        const parentType = typesToFix[mtKey];
        let anyChecked = false;
        if (typesFromGit.toDeploy[mtKey]) {
          const mtType = typesFromGit.toDeploy[mtKey];
          if (mtType.childs && Object.keys(mtType.childs).length > 0) {
            for (const moKey of Object.keys(mtType.childs)) {
              const mtObject = mtType.childs[moKey];
              if (mtObject.checked) {
                anyChecked = true;
              }
              if (mtObject.childs && Object.keys(mtType.childs).length > 0) {
                for (const miKey of Object.keys(mtObject.childs)) {
                  if (mtObject.childs[miKey].checked) {
                    anyChecked = true;
                  }
                }
              }
              if (anyChecked && !typesToAdd.includes(parentType + ':' + moKey)) {
                typesToAdd.push(parentType + ':' + moKey);
              }
            }
          }
        }
      }
      for (const toAdd of typesToAdd) {
        const splits = toAdd.split(':');
        const mtType = splits[0];
        const moType = splits[1];
        if (!typesFromGit.toDeploy[mtType]) {
          typesFromGit.toDeploy[mtType] = new MetadataType(mtType, false);
          typesFromGit.toDeploy[mtType].childs[moType] = new MetadataObject(moType, true);
        } else if (!typesFromGit.toDeploy[mtType].childs[moType]) {
          typesFromGit.toDeploy[mtType].childs[moType] = new MetadataObject(moType, true);
        } else {
          typesFromGit.toDeploy[mtType].childs[moType].checked = true;
        }
      }
    }
  }

  private createPackages(flags: Partial<AhPackageGitCreateFlags>, typesFromGit: TypesFromGit): PackageGeneratorResult {
    const result = new PackageGeneratorResult();
    const packageGenerator = new PackageGenerator(
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root ?? '')?.sourceApiVersion
    ).setExplicit();
    const outputPath = flags['output-path'] ?? '';
    if (
      typesFromGit.toDeploy &&
      (flags.type?.toLowerCase() === 'package' ||
        flags.type?.toLowerCase() === 'p' ||
        flags.type?.toLowerCase() === 'both' ||
        flags.type?.toLowerCase() === 'b')
    ) {
      if (flags.progress) {
        this.log(messages.getMessage('message.creating-file', [PACKAGE_FILENAME]));
      } else {
        this.spinner.status = messages.getMessage('message.creating-file', [PACKAGE_FILENAME]);
      }
      result.package = packageGenerator.createPackage(typesFromGit.toDeploy, outputPath);
    }
    if (
      typesFromGit.toDelete &&
      (flags.type?.toLowerCase() === 'destructive' ||
        flags.type?.toLowerCase() === 'd' ||
        flags.type?.toLowerCase() === 'both' ||
        flags.type?.toLowerCase() === 'b')
    ) {
      if (flags['delete-before']) {
        if (flags.progress) {
          this.log(messages.getMessage('message.creating-file', [DESTRUCT_BEFORE_FILENAME]));
        } else {
          this.spinner.status = messages.getMessage('message.creating-file', [DESTRUCT_BEFORE_FILENAME]);
        }
        result.destructiveChanges = packageGenerator.createBeforeDeployDestructive(typesFromGit.toDelete, outputPath);
      } else {
        if (flags.progress) {
          this.log(messages.getMessage('message.creating-file', [DESTRUCT_AFTER_FILENAME]));
        } else {
          this.spinner.status = messages.getMessage('message.creating-file', [DESTRUCT_AFTER_FILENAME]);
        }
        result.destructiveChangesPost = packageGenerator.createAfterDeployDestructive(
          typesFromGit.toDelete,
          outputPath
        );
      }
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.file-created', [outputPath]));
    } else {
      this.spinner.stop(messages.getMessage('message.file-created', [outputPath]));
    }
    return result;
  }

  private ignoreMetadata(flags: Partial<AhPackageGitCreateFlags>, typesFromGit: TypesFromGit): Promise<TypesFromGit> {
    return new Promise<TypesFromGit>((resolve, reject) => {
      try {
        const ignorePackage = new Ignore(flags['ignore-file']);
        const ignoreDestructive = new Ignore(flags['ignore-destructive-file'] ?? flags['ignore-file']);
        if (typesFromGit.toDeploy) {
          if (flags.progress) {
            this.log(messages.getMessage('message.ignoring-metadata'));
          } else {
            this.spinner.status = messages.getMessage('message.ignoring-metadata');
          }
          typesFromGit.toDeploy = ignorePackage.ignoreMetadata(typesFromGit.toDeploy);
        }
        if (typesFromGit.toDelete) {
          if (flags.progress) {
            this.log(messages.getMessage('message.ignoring-destructive-metadata'));
          } else {
            this.spinner.status = messages.getMessage('message.ignoring-destructive-metadata');
          }
          typesFromGit.toDelete = ignoreDestructive.ignoreMetadata(typesFromGit.toDelete);
        }
        resolve(typesFromGit);
      } catch (error) {
        reject(error);
      }
    });
  }

  private analyzeGitDiffs(flags: Partial<AhPackageGitCreateFlags>, gitDiffs: GitDiff[]): Promise<TypesFromGit> {
    return new Promise<TypesFromGit>((resolve, reject) => {
      const root = flags.root ?? '';
      const alias = ProjectUtils.getOrgAlias(root);
      const namespace = ProjectUtils.getOrgNamespace(root);
      const connector = new SFConnector(
        alias,
        flags['api-version'] ?? ProjectUtils.getProjectConfig(root)?.sourceApiVersion,
        root,
        namespace
      );
      connector.setMultiThread();
      if (flags.progress) {
        this.log(generalMessages.getMessage('message.getting-available-types'));
      } else {
        this.spinner.status = generalMessages.getMessage('message.getting-available-types');
      }
      connector
        .listMetadataTypes()
        .then((metadataDetails) => {
          const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
          if (flags.progress) {
            this.log(messages.getMessage('message.analizing-diff'));
          } else {
            this.spinner.status = messages.getMessage('message.analizing-diff');
          }
          const metadataFromGitDiffs = MetadataFactory.createMetadataTypesFromGitDiffs(
            root,
            gitDiffs,
            folderMetadataMap
          );
          resolve(metadataFromGitDiffs);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getActiveBranch(flags: Partial<AhPackageGitCreateFlags>): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (flags.progress) {
        this.log(messages.getMessage('message.get-active-branch'));
      } else {
        this.spinner.status = messages.getMessage('message.get-active-branch');
      }
      gitManager
        .getBranches()
        .then((branches) => {
          for (const branch of branches) {
            if (branch.active) {
              resolve(branch.name);
              break;
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getGitDiffs(flags: Partial<AhPackageGitCreateFlags>): Promise<GitDiff[]> {
    return new Promise<GitDiff[]>((resolve, reject) => {
      if (flags.progress) {
        this.log(messages.getMessage('message.running-diff'));
      } else {
        this.spinner.status = messages.getMessage('message.running-diff');
      }
      if (!flags.target) {
        flags.target = flags.source as string;
        flags.source = undefined;
      }
      gitManager
        .getDiffs(flags.target, flags.source)
        .then((gitDiffs) => {
          resolve(gitDiffs);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private validateIgnoreFiles(flags: Partial<AhPackageGitCreateFlags>): void {
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
