/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreUtils, FileChecker, MetadataDetail, MetadataItem, MetadataObject, MetadataType } from '@aurahelper/core';
import { StrUtils } from '@aurahelper/core/dist/utils';
import { Connection, Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
const Validator = CoreUtils.Validator;
const Utils = CoreUtils.Utils;

const DURATION_UNITS: { [key: string]: number } = {
  Y: 8 * 60 * 365,
  M: 8 * 60 * 30,
  W: 8 * 60 * 7,
  D: 8 * 60,
  h: 60,
  m: 1,
};

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

  public static getPaths(paths: string | string[], flagName: string, isFolder?: boolean): string[] {
    const result: string[] = [];
    const resultTmp: string[] = Utils.forceArray<string>(paths);
    for (const typeTmp of resultTmp) {
      typeTmp
        .trim()
        .split(',')
        .map((path) => path.trim())
        .forEach((path) => {
          if (!isFolder) {
            const validatedPath = CommandUtils.validateFilePath(path.trim(), flagName);
            if (!result.includes(validatedPath)) {
              result.push(validatedPath);
            }
          } else {
            const validatedPath = CommandUtils.validateFolderPath(path.trim(), flagName);
            if (!result.includes(validatedPath)) {
              result.push(validatedPath);
            }
          }
        });
    }
    return result;
  }

  public static getTypes(type: string | string[]): string[] {
    const result: string[] = [];
    const types: string[] = Utils.forceArray<string>(type);
    for (const typeTmp of types) {
      typeTmp
        .trim()
        .split(',')
        .map((t) => t.trim())
        .forEach((t) => {
          if (!result.includes(t)) {
            result.push(t);
          }
        });
    }
    return result;
  }

  public static getAdvanceTypes(type: string | string[]): { [key: string]: MetadataType } {
    const types: { [key: string]: MetadataType } = {};
    const typesTmp: string[] = Utils.forceArray<string>(type);
    for (const t of typesTmp) {
      t.split(',')
        .map((typeTmp) => typeTmp.trim())
        .forEach((typeTmp) => {
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
        });
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

  public static validateJSONFile(file: string, flagName: string): unknown {
    try {
      return Validator.validateJSONFile(file);
    } catch (error) {
      const err = error as Error;
      throw generalMessages.createError('error.wrong-file', [flagName, err.message]);
    }
  }

  public static minutesToDurationString(minutes: number, skipZeroValues?: boolean, limitTo?: string): string {
    if (!minutes) return '';
    const result = [];
    for (const name of Object.keys(DURATION_UNITS)) {
      const p = Math.floor(minutes / DURATION_UNITS[name]);
      if (p === 0) {
        if (!skipZeroValues) result.push(p.toString() + name);
      } else {
        result.push(p.toString() + name);
      }
      minutes %= DURATION_UNITS[name];
      if (limitTo && name === limitTo.toUpperCase()) {
        break;
      }
    }
    return result.join(' ');
  }

  public static durationStringToMinutes(duration: string): number {
    if (!duration) return 0;
    const splits = duration.split(' ');
    const units = Object.keys(DURATION_UNITS);
    let minutes = 0;
    for (const split of splits) {
      for (const unit of units) {
        if (StrUtils.containsIgnorecase(split, unit)) {
          const value = Number(StrUtils.replace(split, unit.toUpperCase(), '').trim());
          minutes += value * DURATION_UNITS[unit.toUpperCase()];
        }
      }
    }
    return minutes;
  }

  public static async queryData<T extends Record<string, T>>(connection: Connection, query: string): Promise<T[]> {
    const result = await connection.query<T>(query);
    if (!result.records || result.records.length === 0) {
      return [];
    } else {
      return result.records;
    }
  }

  public static async toolingQueryData(connection: Connection, query: string): Promise<any[]> {
    const records = [];
    let result = await connection.tooling.query(query);
    records.push(...result.records);
    while (!result.done) {
      // eslint-disable-next-line no-await-in-loop
      result = await connection.tooling.queryMore(result.nextRecordsUrl as string);
      records.push(...result.records);
    }
    return records;
  }
}
