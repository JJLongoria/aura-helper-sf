/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';
import { FileChecker, FileWriter, PathUtils } from '@aurahelper/core';

import CommandUtils from '../../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.permissions.get');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhMetadataOrgPermissionsGet extends SfCommand<string[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:metadata:permissions:org:get',
    'ah:metadata:get:org:permissions',
    'ah:metadata:get:permissions:org',
    'ah:metadata:permissions:get:org',
    'ah:metadata:org:permissions:get',
    'ah:org:permissions:metadata:get',
    'ah:org:metadata:permissions:get',
    'ah:org:get:metadata:permissions',
    'ah:org:get:permissions:metadata',
    'ah:org:permissions:get:metadata',
    'ah:org:metadata:get:permissions',
    'ah:permissions:org:metadata:get',
    'ah:permissions:org:get:metadata',
    'ah:permissions:metadata:org:get',
    'ah:permissions:get:org:metadata',
    'ah:permissions:get:metadata:org',
    'ah:permissions:metadata:get:org',
    'ah:get:org:metadata:permissions',
    'ah:get:permissions:org:metadata',
    'ah:get:metadata:org:permissions',
    'ah:get:metadata:permissions:org',
    'ah:get:permissions:metadata:org',
    'ah:get:org:permissions:metadata',
    'ah:org:permissions:get',
    'ah:org:get:permissions',
    'ah:get:org:permissions',
    'ah:get:permissions:org',
    'ah:permissions:org:get',
    'ah:permissions:get:org',
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
    'output-file': Flags.file({
      summary: generalMessages.getMessage('flags.output-file.summary'),
      description: generalMessages.getMessage('flags.output-file.description'),
      helpValue: '<path/to/output/file>',
    }),
    csv: Flags.boolean({
      summary: messages.getMessage('flags.csv.summary'),
      description: messages.getMessage('flags.csv.description'),
    }),
  };

  public async run(): Promise<string[]> {
    const { flags } = await this.parse(AhMetadataOrgPermissionsGet);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-get'));
    } else {
      this.log(messages.getMessage('message.running-get'));
    }
    const alias = flags['target-org']?.getUsername() ?? ProjectUtils.getOrgAlias(flags.root) ?? '';
    const namespace = ProjectUtils.getOrgNamespace(flags.root);
    const connector = new SFConnector(
      alias,
      flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
      flags.root,
      namespace
    );
    connector.setMultiThread();
    const permissions = await connector.loadUserPermissions(PathUtils.getAuraHelperSFTempFilesPath());
    if (!flags.json) {
      if (permissions && permissions.length > 0) {
        if (flags.csv) {
          const csvData = CommandUtils.transformPermissionsToCSV(permissions);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformPermissionsToTable(permissions);
          this.table(datatable as never, {
            columns: [
              {
                key: 'name',
                label: 'API Name',
              },
            ] as never,
          });
        }
      } else {
        this.log(messages.getMessage('error.no-data'));
      }
    }
    if (flags['output-file']) {
      const baseDir = PathUtils.getDirname(flags['output-file']);
      if (!FileChecker.isExists(baseDir)) {
        FileWriter.createFolderSync(baseDir);
      }
      const content = flags.csv
        ? CommandUtils.transformPermissionsToCSV(permissions)
        : JSON.stringify(permissions, null, 2);
      FileWriter.createFileSync(flags['output-file'], content);
      this.log(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
    }
    return permissions;
  }
}
