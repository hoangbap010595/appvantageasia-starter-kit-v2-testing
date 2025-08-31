import os from 'node:os';

const forEachParallel = async <T>(
    items: T[],
    func: (item: T) => Promise<void>,
    concurrency = os.cpus().length
): Promise<void> => {
    const promises: Promise<unknown>[] = [];

    for (const item of items) {
        // Start processing the item and add its promise to the list
        const thisPromise = func(item).then(() => {
            // remove the resolved promise from the active list
            promises.splice(
                promises.findIndex(promise => thisPromise === promise),
                1
            );
        });

        // push the active promise into the list
        promises.push(thisPromise);

        // If we reach concurrency limit, wait for one promise to finish
        if (promises.length >= concurrency) {
            await Promise.race(promises);
        }
    }

    // after the loop, wait for all remaining promises to resolve
    await Promise.all(promises);
};

export default forEachParallel;
