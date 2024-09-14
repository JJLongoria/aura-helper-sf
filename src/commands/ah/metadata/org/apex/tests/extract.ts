/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import StringSimilarity from 'string-similarity';
import { FileChecker, FileWriter } from '@aurahelper/core';
import CommandUtils from '../../../../../../libs/utils/commandUtils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.metadata.org.apex.tests.extract');
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export type AhMetadataOrgApexTestsExtractResult = {
  path: string;
  classes: any;
};

export default class AhMetadataOrgApexTestsExtract extends SfCommand<AhMetadataOrgApexTestsExtractResult> {
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
    'output-dir': Flags.directory({
      summary: generalMessages.getMessage('flags.output-dir.summary'),
      description: generalMessages.getMessage('flags.output-dir.description'),
      helpValue: '<path/to/output/dir>',
      default: './',
    }),
    filename: Flags.string({
      summary: generalMessages.getMessage('flags.filename.summary'),
      description: generalMessages.getMessage('flags.filename.description'),
    }),
    'save-result': Flags.boolean({
      summary: messages.getMessage('flags.save-result.summary'),
      description: messages.getMessage('flags.save-result.description'),
    }),
  };

  public async run(): Promise<AhMetadataOrgApexTestsExtractResult> {
    const { flags } = await this.parse(AhMetadataOrgApexTestsExtract);
    try {
      this.spinner.start('Extrayendo la información de las clases de test. Esta operación puede tardar unos minutos.');
      if (flags['output-dir']) {
        flags['output-dir'] = CommandUtils.validateFolderPath(flags['output-dir'], '--output-dir');
      }
      const org = flags['target-org'];
      const connection = org.getConnection(flags['api-version']);
      const codeCoverageInfo = await CommandUtils.toolingQueryData(
        connection,
        'SELECT ApexClassOrTriggerId,ApexClassOrTrigger.Name,ApexTestClassId,ApexTestClass.Name,TestMethodName FROM ApexCodeCoverage'
      );
      const classes: any = {};
      for (const codeCoverage of codeCoverageInfo) {
        let apexClassData = classes[codeCoverage.ApexClassOrTrigger.Name];
        if (!apexClassData) {
          apexClassData = {
            name: codeCoverage.ApexClassOrTrigger.Name,
            testClasses: [codeCoverage.ApexTestClass.Name],
          };
          classes[codeCoverage.ApexClassOrTrigger.Name] = apexClassData;
        }
        if (!apexClassData.testClasses.includes(codeCoverage.ApexTestClass.Name)) {
          apexClassData.testClasses.push(codeCoverage.ApexTestClass.Name);
        }
      }
      // eslint-disable-next-line guard-for-in
      for (const apexClassName in classes) {
        const apexClass = classes[apexClassName];
        let similarity = 0;
        let mostSimilar = '';
        for (const testClass of apexClass.testClasses) {
          const similarityValue = StringSimilarity.compareTwoStrings(apexClass.name, testClass) * 100;
          if (similarityValue > similarity) {
            similarity = similarityValue;
            mostSimilar = testClass;
          }
        }
        apexClass.mainTestClass = mostSimilar;
      }
      let path = '';
      if (flags['save-result']) {
        if (!FileChecker.isExists(flags['output-dir'])) {
          FileWriter.createFolderSync(flags['output-dir']);
        }
        path =
          flags['ouput-dir'] ?? flags['output-dir'] + '/' + (flags.filename ?? `Test Classes Map - ${Date.now()}.json`);
        FileWriter.createFileSync(path, JSON.stringify(classes, null, 2));
      }
      this.spinner.stop();
      return {
        path,
        classes,
      };
    } catch (error) {
      this.logJson(error);
    }
    return {
      path: '',
      classes: {},
    };
  }
}
