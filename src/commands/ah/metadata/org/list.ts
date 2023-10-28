/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { FileChecker, FileWriter, MetadataDetail, PathUtils } from '@aurahelper/core';
import { ProjectUtils } from '@aurahelper/core/dist/utils';
import { SFConnector } from '@aurahelper/connector';

import CommandUtils from '../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.list');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class AhMetadataOrgList extends SfCommand<MetadataDetail[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:list:org:metadata',
    'ah:list:metadata:org',
    'ah:metadata:list:org',
    'ah:org:metadata:list',
    'ah:org:list:metadata',
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
    progress: Flags.boolean({
      char: 'p',
      summary: generalMessages.getMessage('flags.progress.summary'),
      description: generalMessages.getMessage('flags.progress.description'),
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
    }),
    csv: Flags.boolean({
      summary: messages.getMessage('flags.csv.summary'),
      description: messages.getMessage('flags.csv.description'),
    }),
  };

  public async run(): Promise<MetadataDetail[]> {
    const { flags } = await this.parse(AhMetadataOrgList);
    if (!flags['target-org']) {
      flags.root = CommandUtils.validateProjectPath(flags.root);
    }
    if (flags['output-file']) {
      flags['output-file'] = CommandUtils.validateFilePath(flags['output-file'], '--output-file');
    }
    if (!flags.progress) {
      this.spinner.start(messages.getMessage('message.running-list'));
    } else {
      this.log(messages.getMessage('message.running-list'));
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
    if (flags.progress) {
      this.log(generalMessages.getMessage('message.getting-available-types'));
    } else {
      this.spinner.status = generalMessages.getMessage('message.getting-available-types');
    }
    const metadataDetails = await connector.listMetadataTypes();
    if (!flags.json) {
      if (metadataDetails?.length > 0) {
        if (flags.csv) {
          const csvData = CommandUtils.transformMetadataDetailsToCSV(metadataDetails);
          this.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataDetailsToTable(metadataDetails);
          this.table(datatable as never, {
            name: {
              header: 'Name',
            },
            directory: {
              header: 'Directory',
            },
            suffix: {
              header: 'Suffix',
            },
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
        ? CommandUtils.transformMetadataDetailsToCSV(metadataDetails)
        : JSON.stringify(metadataDetails, null, 2);
      FileWriter.createFileSync(flags['output-file'], content);
      this.log(generalMessages.getMessage('message.output-saved', [flags['output-file']]));
    }
    if (!flags.progress) {
      this.spinner.stop(messages.getMessage('message.finished'));
    } else {
      this.log(messages.getMessage('message.finished'));
    }
    return metadataDetails;
  }
}
