/* eslint-disable sf-plugin/no-unnecessary-aliases */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, SfError } from '@salesforce/core';
import { MetadataType, PathUtils, ProgressStatus, RetrieveResult, SpecialMetadata } from '@aurahelper/core';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { SFConnector } from '@aurahelper/connector';
import { ProjectUtils } from '@aurahelper/core/dist/utils';

import CommandUtils from '../../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.special.retrieve');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];

export default class AhMetadataOrgSpecialRetrieve extends SfCommand<RetrieveResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = [
    'ah:retrieve:special:org:metadata',
    'ah:retrieve:special:metadata:org',
    'ah:retrieve:org:metadata:special',
    'ah:retrieve:org:special:metadata',
    'ah:retrieve:metadata:org:special',
    'ah:retrieve:metadata:special:org',
    'ah:org:retrieve:metadata:special',
    'ah:org:metadata:retrieve:special',
    'ah:org:metadata:special:retrieve',
    'ah:org:retrieve:special:metadata',
    'ah:org:special:retrieve:metadata',
    'ah:org:special:metadata:retrieve',
    'ah:metadata:retrieve:org:special',
    'ah:metadata:org:retrieve:special',
    'ah:metadata:special:retrieve:org',
    'ah:metadata:special:org:retrieve',
    'ah:metadata:retrieve:special:org',
    'ah:special:retrieve:metadata:org',
    'ah:special:metadata:retrieve:org',
    'ah:special:metadata:org:retrieve',
    'ah:special:retrieve:org:metadata',
    'ah:special:org:retrieve:metadata',
    'ah:special:org:metadata:retrieve',
    'ah:org:special:retrieve',
    'ah:special:org:retrieve',
    'ah:org:retrieve:special',
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
    all: Flags.boolean({
      summary: messages.getMessage('flags.all.summary'),
      description: messages.getMessage('flags.all.description', [Object.keys(SpecialMetadata).join(',')]),
      exclusive: ['type'],
    }),
    type: Flags.string({
      summary: messages.getMessage('flags.type.summary'),
      description: messages.getMessage('flags.type.description'),
      char: 't',
      exclusive: ['all'],
    }),
    'download-all': Flags.boolean({
      summary: messages.getMessage('flags.download-all.summary'),
      description: messages.getMessage('flags.download-all.description'),
    }),
    compress: Flags.boolean({
      summary: messages.getMessage('flags.compress.summary'),
      description: messages.getMessage('flags.compress.description'),
      char: 'c',
    }),
    'sort-order': Flags.string({
      summary: generalMessages.getMessage('flags.sort-order.summary'),
      description: generalMessages.getMessage('flags.sort-order.description'),
      options: sortOrderValues,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
    }),
  };

  private retrievedFinished = false;

  // eslint-disable-next-line sf-plugin/no-classes-in-command-return-type
  public async run(): Promise<RetrieveResult> {
    const { flags } = await this.parse(AhMetadataOrgSpecialRetrieve);
    this.retrievedFinished = false;
    flags.root = CommandUtils.validateProjectPath(flags.root);
    if (!flags.all && !flags.type) {
      throw new SfError(messages.getMessage('error.missing-types'));
    }
    if (flags.progress) {
      this.log(messages.getMessage('message.running-retrieve'));
    } else {
      this.spinner.start(messages.getMessage('message.running-retrieve'));
    }
    try {
      let types: { [key: string]: MetadataType } | undefined;
      if (flags.type && !flags.all) {
        types = CommandUtils.getAdvanceTypes(flags.type);
      }
      const alias = ProjectUtils.getOrgAlias(flags.root);
      const namespace = ProjectUtils.getOrgNamespace(flags.root);
      const connector = new SFConnector(
        alias,
        flags['api-version'] ?? ProjectUtils.getProjectConfig(flags.root)?.sourceApiVersion,
        flags.root,
        namespace
      );
      connector.setMultiThread();
      connector.onLoadingOrg(() => {
        if (flags.progress) {
          this.log(messages.getMessage('message.loading-org'));
        } else {
          this.spinner.status = messages.getMessage('message.loading-org');
        }
      });
      connector.onAfterDownloadType((status) => {
        if (flags.progress) {
          this.log(messages.getMessage('message.after-download', [status.entityType]));
        } else {
          this.spinner.status = messages.getMessage('message.after-download', [status.entityType]);
        }
      });
      connector.onRetrieve(() => {
        if (!flags.json) {
          this.reportRetrieveProgress(2500, flags.progress);
        }
        if (flags.progress) {
          this.log(messages.getMessage('message.on-retrieve'));
        } else {
          this.spinner.status = messages.getMessage('message.on-retrieve');
        }
      });
      connector.onCopyData(() => {
        this.retrievedFinished = true;
      });
      connector.onCopyFile((status: ProgressStatus) => {
        if (flags.progress) {
          this.log(
            messages.getMessage('message.copy-files', [PathUtils.getBasename(status.data as string), status.data])
          );
        } else {
          this.spinner.status = messages.getMessage('message.copy-files', [
            PathUtils.getBasename(status.data as string),
            status.data,
          ]);
        }
      });
      const retrieveOut = await connector.retrieveOrgSpecialTypes(
        PathUtils.getAuraHelperSFDXTempFilesPath(),
        types,
        flags['download-all'],
        flags.compress,
        flags['sort-order']
      );
      if (flags.progress) {
        this.log(messages.getMessage('message.retrieve-finished'));
      } else {
        this.spinner.stop(messages.getMessage('message.retrieve-finished'));
      }
      return retrieveOut;
    } catch (error) {
      const err = error as Error;
      throw new SfError(err.message);
    }
  }

  private reportRetrieveProgress(millis: number, progress: boolean): void {
    if (!this.retrievedFinished) {
      setTimeout(() => {
        if (!this.retrievedFinished) {
          if (progress) {
            this.log(messages.getMessage('message.retrieve-in-progress', [new Date().getTime()]));
          } else {
            this.spinner.status = messages.getMessage('message.retrieve-in-progress', [new Date().getTime()]);
          }
          this.reportRetrieveProgress(millis, progress);
        }
      }, millis);
    }
  }
}