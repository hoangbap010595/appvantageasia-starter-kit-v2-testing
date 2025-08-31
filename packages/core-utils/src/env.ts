import identity from 'lodash/fp/identity.js';
import toInteger from 'lodash/fp/toInteger.js';
import toNumber from 'lodash/fp/toNumber.js';

export const toBoolean = (value: string) => value === 'true' || value === '1' || value === 'on' || false;

const makeGetValue = <T>(format: (value: string) => T) => {
    function getValue(key: string, fallbackValue: T): T;
    function getValue(key: string): T | undefined;
    function getValue(key: string, fallbackValue?: T): T | undefined {
        const value = process.env[key];

        return value === undefined || value === '' ? fallbackValue : format(value);
    }

    return getValue;
};

export const getString = makeGetValue<string>(identity);

export const getInteger = makeGetValue<number>(toInteger);

export const getNumber = makeGetValue<number>(toNumber);

export const getBoolean = makeGetValue<boolean>(toBoolean);

const makeGetStringList = (separator: string) => {
    function getValue(key: string, fallbackValue: string[]): string[];
    function getValue(key: string): string[] | undefined;
    function getValue(key: string, fallbackValue?: string[]): string[] | undefined {
        const value = getString(key);

        return value?.split(separator) || fallbackValue;
    }

    return getValue;
};

export const getStringListFromComma = makeGetStringList(',');

export const getStringListFromSpace = makeGetStringList(' ');

export const getEnvKey = (key: string, prefix = 'APP') => `${prefix}_${key}`;

getEnvKey.addPostPrefix =
    (postPrefix: string) =>
    (key: string, prefix = 'APP') =>
        getEnvKey(`${postPrefix}_${key}`, prefix);
