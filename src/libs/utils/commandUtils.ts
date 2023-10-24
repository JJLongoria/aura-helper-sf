import { CoreUtils, FileChecker, MetadataDetail, MetadataItem, MetadataObject, MetadataType } from '@aurahelper/core';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
const Validator = CoreUtils.Validator;
const Utils = CoreUtils.Utils;

export interface MetadataDescribeTableFields {
  type: string;
  object?: string;
  item?: string;
  path?: string;
}

Messages.importMessagesDirectory(__dirname);
const generalMessages = Messages.loadMessages('aura-helper-sf', 'general');

export default class CommandUtils {
  public static getProjectPaths(paths: string | string[], root: string, isFolder?: boolean): string[] {
    const result: string[] = [];
    if (!root.endsWith('/') && !root.endsWith('\\')) {
      root += '/';
    }
    const resultTmp: string[] = Utils.forceArray<string>(paths);
    for (let typeTmp of resultTmp) {
      typeTmp = typeTmp.trim();
      const path: string = typeTmp.startsWith('./') && typeTmp !== root ? root + typeTmp.substring(2) : typeTmp;
      if (!isFolder) {
        result.push(Validator.validateFilePath(path.trim()));
      } else {
        result.push(Validator.validateFolderPath(path.trim()));
      }
    }
    return result;
  }

  public static getPaths(paths: string | string[], isFolder?: boolean): string[] {
    const result: string[] = [];
    const resultTmp: string[] = Utils.forceArray<string>(paths);
    for (const typeTmp of resultTmp) {
      const path = typeTmp.trim();
      if (!isFolder) {
        result.push(Validator.validateFilePath(path.trim()));
      } else {
        result.push(Validator.validateFolderPath(path.trim()));
      }
    }
    return result;
  }

  public static getTypes(type: string | string[]): string[] {
    const types: string[] = [];
    const typesTmp: string[] = Utils.forceArray<string>(type);
    for (const typeTmp of typesTmp) {
      types.push(typeTmp.trim());
    }
    return types;
  }

  public static getAdvanceTypes(type: string | string[]): { [key: string]: MetadataType } {
    const types: { [key: string]: MetadataType } = {};
    const typesTmp: string[] = Utils.forceArray<string>(type);
    for (const typeTmp of typesTmp) {
      if (typeTmp.includes(':')) {
        const splits = typeTmp.split(':');
        if (splits.length === 2) {
          const metadataType = splits[0].trim();
          const metadataObject = splits[1].trim();
          if (!types[metadataType]) {
            types[metadataType] = new MetadataType(metadataType, false);
          }
          if (!types[metadataType].childs[metadataObject] && metadataObject !== '*') {
            types[metadataType].addChild(new MetadataObject(metadataObject, true));
          }
          if (metadataObject === '*') {
            types[metadataType].checked = true;
          }
        } else if (splits.length === 3) {
          const metadataType = splits[0].trim();
          const metadataObject = splits[1].trim();
          const metadataItem = splits[2].trim();
          if (!types[metadataType]) {
            types[metadataType] = new MetadataType(metadataType, false);
          }
          if (!types[metadataType].childs[metadataObject] && metadataObject !== '*') {
            types[metadataType].addChild(new MetadataObject(metadataObject, false));
          }
          if (!types[metadataType].childs[metadataObject].childs[metadataItem] && metadataItem !== '*') {
            types[metadataType].childs[metadataObject].addChild(new MetadataItem(metadataItem, true));
          }
          if (metadataObject === '*') {
            types[metadataType].checked = true;
          }
          if (metadataItem === '*') {
            types[metadataType].childs[metadataObject].checked = true;
          }
        }
      } else {
        const metadataType = typeTmp.trim();
        types[metadataType] = new MetadataType(metadataType, true);
      }
    }
    return types;
  }

  public static transformMetadataTypesToTable(metadata: {
    [key: string]: MetadataType;
  }): MetadataDescribeTableFields[] {
    const result: MetadataDescribeTableFields[] = [];
    for (const metadataTypeName of Object.keys(metadata)) {
      const metadataType = metadata[metadataTypeName];
      if (metadataType.hasChilds()) {
        for (const metadataObjectName of metadataType.getChildKeys()) {
          const metadataObject = metadataType.getChild(metadataObjectName);
          if (metadataObject?.hasChilds()) {
            for (const metadataItemName of metadataObject.getChildKeys()) {
              const metadataItem = metadataObject.getChild(metadataItemName);
              if (metadataItem) {
                result.push({
                  type: metadataTypeName,
                  object: metadataObjectName,
                  item: metadataItemName,
                  path: metadataItem.path,
                });
              }
            }
          } else if (metadataObject) {
            result.push({
              type: metadataTypeName,
              object: metadataObjectName,
              path: metadataObject.path,
            });
          }
        }
      } else {
        result.push({
          type: metadataTypeName,
          path: metadataType.path,
        });
      }
    }
    return result;
  }

  public static transformMetadataTypesToCSV(metadata: { [key: string]: MetadataType }): string {
    let result = 'Metadata Type;Metadata Object;Metadata Item;Path';
    for (const metadataTypeName of Object.keys(metadata)) {
      const metadataType = metadata[metadataTypeName];
      if (metadataType.hasChilds()) {
        for (const metadataObjectName of metadataType.getChildKeys()) {
          const metadataObject = metadataType.getChild(metadataObjectName);
          if (metadataObject?.hasChilds()) {
            for (const metadataItemName of metadataObject.getChildKeys()) {
              const metadataItem = metadataObject.getChild(metadataItemName);
              if (metadataItem) {
                result +=
                  '\n' +
                  metadataTypeName +
                  ';' +
                  metadataObjectName +
                  ';' +
                  metadataItemName +
                  ';' +
                  (metadataItem.path ?? '');
              }
            }
          } else if (metadataObject) {
            result += '\n' + metadataTypeName + ';' + metadataObjectName + ';;' + (metadataObject.path ?? '');
          }
        }
      } else {
        result += '\n' + metadataTypeName + ';;;' + (metadataType.path ?? '');
      }
    }
    return result;
  }

  public static transformMetadataDetailsToTable(metadataDetails: MetadataDetail[]): AnyJson[] {
    const result: AnyJson[] = [];
    for (const detail of metadataDetails) {
      result.push({
        name: detail.xmlName,
        directory: detail.directoryName,
        suffix: detail.suffix,
      });
    }
    return result;
  }

  public static transformMetadataDetailsToCSV(metadataDetails: MetadataDetail[]): string {
    let result = 'Name;Directory;Suffix';
    for (const detail of metadataDetails) {
      result += '\n' + detail.xmlName + ';' + (detail.directoryName ?? '') + ';' + (detail.suffix ?? '');
    }
    return result;
  }

  public static transformPermissionsToCSV(permissions: string[]): string {
    let result = 'API Name';
    for (const permission of permissions) {
      result += '\n' + permission;
    }
    return result;
  }

  public static transformPermissionsToTable(permissions: string[]): AnyJson[] {
    const result: AnyJson[] = [];
    for (const permission of permissions) {
      result.push({
        name: permission,
      });
    }
    return result;
  }

  public static validateProjectPath(root?: string): string {
    let validatedRoot;
    try {
      validatedRoot = Validator.validateFolderPath(root);
    } catch (error) {
      const err = error as Error;
      throw generalMessages.createError('error.root', [root, err.message]);
    }
    if (!FileChecker.isSFDXRootPath(validatedRoot)) {
      throw generalMessages.createError('error.project-not-found');
    }
    return validatedRoot;
  }

  public static validateFolderPath(folder: string, flagName: string): string {
    try {
      return Validator.validateFolderPath(folder);
    } catch (error) {
      const err = error as Error;
      throw generalMessages.createError('error.wrong-directory', [flagName, err.message]);
    }
  }

  public static validateFilePath(file: string, flagName: string): string {
    try {
      return Validator.validateFilePath(file);
    } catch (error) {
      const err = error as Error;
      throw generalMessages.createError('error.wrong-file', [flagName, err.message]);
    }
  }

  public static validateJSONFile(file: string, flagName: string): string {
    try {
      Validator.validateJSONFile(file);
    } catch (error) {
      const err = error as Error;
      throw generalMessages.createError('error.wrong-file', [flagName, err.message]);
    }
  }
}
