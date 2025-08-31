const createLazyGetter = <V>(loadFunction: () => Promise<V>) => {
    let resolvedValue: V | null = null;
    let promise: Promise<V> | null = null;

    return (): Promise<V> => {
        if (resolvedValue) {
            return Promise.resolve(resolvedValue);
        }

        if (promise) {
            return promise;
        }

        promise = loadFunction().then(result => {
            // clean up actions
            resolvedValue = result;
            promise = null;

            // forward abilities
            return resolvedValue;
        });

        return promise;
    };
};

export default createLazyGetter;
