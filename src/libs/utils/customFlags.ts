import { Flags } from '@salesforce/sf-plugins-core';
import { CustomOptions, FlagDefinition, OptionFlagDefaults } from '@oclif/core/lib/interfaces/parser';

export const CustomFlags = {
  array: (options: Partial<OptionFlagDefaults<string[], CustomOptions>>): FlagDefinition<string[], CustomOptions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options.parse = (input: string): any => parseArray(input);
    return Flags.custom<string[]>(options);
  },
};

// eslint-disable-next-line @typescript-eslint/require-await
export function parseArray(str: string): string[] {
  if (!str || str.length === 0) {
    return [];
  }
  const regex = new RegExp('"(.*?)"|\'(.*?)\'|,');
  return str
    .split(regex)
    .filter((i) => Boolean(i))
    .map((i) => i.trim());
}
