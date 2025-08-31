// add a 10 to the default array as base zIndex;
import { useEffect, useMemo, useRef } from 'react';

let currentIndexes: number[] = [];

export const pop = (index: number) => {
    // filter out the index from the global array
    currentIndexes = currentIndexes.filter(item => item !== index);
};

export const push = () => {
    // get the number of indexes provided
    const { length } = currentIndexes;
    // the highest index is the latest allocated to at the end of the list
    // plus one if there is any index, otherwise starts at 10
    const nextIndex = length ? currentIndexes[length - 1] + 1 : 10;
    // update the global array
    currentIndexes = [...currentIndexes, nextIndex];

    return { value: nextIndex, pop: () => pop(nextIndex) };
};

export const useZIndex = (enabled = true) => {
    // use a reference to not nullify the index when it turn from enabled to disabled
    // this is to avoid transition to not have time to properly close
    const latestIndex = useRef<undefined | number>(undefined);

    // use memo to allocate an index whenever enabled turned true
    const index = useMemo(() => (enabled ? push() : null), [enabled]);

    // maintain the index on the latest provided index
    if (index !== null) {
        latestIndex.current = index.value;
    }

    // pop the allocated index if this hook is unmounted
    useEffect(() => (index ? index.pop() : () => undefined), [index]);

    return latestIndex.current;
};
