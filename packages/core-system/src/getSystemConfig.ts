import getCollections from './getCollections.js';

const getSystemConfig = async <Value extends object = any>(key: string): Promise<Value | null> => {
    const { configs } = await getCollections();
    const config = await configs.findOne({ key });

    return (config?.value as Value) || null;
};

export default getSystemConfig;
