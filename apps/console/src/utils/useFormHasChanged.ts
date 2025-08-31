import isDeepEqual from 'fast-deep-equal';
import { useMemo } from 'react';
import type { Control } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

const useFormHasChanged = (control?: Control<any, any>) => {
    // if control is initially provided it should always be provided afterward
    // otherwise the number of hook will change which will trigger a React internal error
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const finalControl = control || useForm<any>().control;
    const values = useWatch({ control });

    return useMemo(() => !isDeepEqual(finalControl._defaultValues, values), [finalControl, values]);
};

export default useFormHasChanged;
