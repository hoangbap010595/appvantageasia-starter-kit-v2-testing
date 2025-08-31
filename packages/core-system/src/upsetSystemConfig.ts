import getCollections from './getCollections.js';

const upsetSystemConfig = async <Value extends object = any>(key: string, value: Value | null): Promise<void> => {
    const { configs } = await getCollections();

    if (value === null) {
        await configs.deleteOne({ key });
    } else {
        await configs.updateOne({ key }, { $set: { value } }, { upsert: true });
    }
};

export default upsetSystemConfig;
