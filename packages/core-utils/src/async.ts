export const map = async <T, U>(
    array: T[],
    callback: (item: T, index: number, array: T[]) => Promise<U> | U
): Promise<U[]> => {
    const results: U[] = [];

    for (let i = 0; i < array.length; i++) {
        results.push(await callback(array[i], i, array));
    }

    return results;
};

export const forEach = async <T>(
    array: T[],
    callback: (item: T, index: number, array: T[]) => Promise<void>
): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const reduce = async <T, U>(
    array: T[],
    reducer: (accumulator: U, currentValue: T, index: number, array: T[]) => Promise<U>,
    initialValue: U
): Promise<U> => {
    let accumulator = initialValue;

    for (let index = 0; index < array.length; index++) {
        accumulator = await reducer(accumulator, array[index], index, array);
    }

    return accumulator;
};

export const filter = async <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> =>
    reduce(
        array,
        async (accumulator, value, index, array) => {
            const shouldKeep = await predicate(value, index, array);

            return shouldKeep ? [...accumulator, value] : accumulator;
        },
        [] as T[]
    );
