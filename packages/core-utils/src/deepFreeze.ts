const deepFreeze = <O extends object>(source: O): O =>
    Object.freeze(
        Object.entries(source).reduce(
            (acc, [property, value]) => ({
                ...acc,
                [property]: value && typeof value === 'object' ? deepFreeze(value) : value,
            }),
            { ...source }
        )
    );

export default deepFreeze;
