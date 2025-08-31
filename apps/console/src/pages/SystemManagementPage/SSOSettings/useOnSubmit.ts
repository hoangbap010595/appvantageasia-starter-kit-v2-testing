import { useApolloClient } from '@apollo/client';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import type { UpdateSsoMutation, UpdateSsoMutationVariables, GetSsoQueryHookResult } from './UpdateSSO.api';
import { UpdateSsoDocument } from './UpdateSSO.api';
import type { OutputValues } from './useFormSchema';
import * as notifications from '@/utils/notifications';

const useOnSubmit = (
    t: TFunction,
    refetch: GetSsoQueryHookResult['refetch'],
    setError: UseFormSetError<OutputValues>
) => {
    const apolloClient = useApolloClient();

    return useCallback(
        async (values: OutputValues) => {
            const mutation = await apolloClient.mutate<UpdateSsoMutation, UpdateSsoMutationVariables>({
                mutation: UpdateSsoDocument,
                variables: { settings: values },
            });

            const response = mutation.data?.updateSSOConfiguration;

            if (response?.__typename === 'UpdateSSOSuccessfulResponse') {
                notifications.success({ message: t('system:updateSuccessful') });

                await refetch();

                return;
            }

            if (response?.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            // display the error message
            response.fields?.forEach(error => {
                setError(error.field as any, { type: 'backend', message: error.message });
            });
        },
        [t, refetch, setError, apolloClient]
    );
};

export default useOnSubmit;
