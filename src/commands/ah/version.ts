import { SfCommand } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { FileReader, PathUtils } from '@aurahelper/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sf', 'ah.version');

export interface PackageFile {
  version: string;
}

export type AhVersionResult = {
  version: string;
};

export default class AhVersion extends SfCommand<AhVersionResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public async run(): Promise<AhVersionResult> {
    return new Promise((resolve) => {
      let dirName: string = __dirname;
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getAbsolutePath(dirName);
      const packageDir = dirName + '/package.json';
      const content: string = FileReader.readFileSync(packageDir);
      const config = JSON.parse(content) as PackageFile;
      this.log(`Aura Helper SF Version: v${config.version}`);
      resolve({ version: config.version });
    });
  }
}
