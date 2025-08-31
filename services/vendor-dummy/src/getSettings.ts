import { getSystemConfig } from '@appvantageasia/core-system';

export interface Settings {
    /* this is only meant as an example */
    username: string;
    password: string;
    endpoint: string;
}

const getSettings = async () => {
    const settings = await getSystemConfig<Settings>('vendor_dummy');

    if (!settings) {
        throw new Error('Settings not found');
    }

    return settings;
};

export default getSettings;
