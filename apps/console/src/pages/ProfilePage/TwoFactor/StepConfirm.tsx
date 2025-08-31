import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import type { Dispatch } from 'react';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { EnableAuthenticatorMutationVariables, EnableAuthenticatorMutation } from './EnableAuthenticator.api';
import { EnableAuthenticatorDocument } from './EnableAuthenticator.api';
import type { Action } from './useStep';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import type { ModalProps } from '@/components/common/Modal';
import Space from '@/components/common/Space';
import InputField from '@/components/fields/InputField';
import * as notifications from '@/utils/notifications';

type StepConfirmProps = Pick<ModalProps, 'open'> & {
    dispatch: Dispatch<Action>;
    refetch: () => unknown;
    setOpen: (state: boolean) => void;
};

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            code: z.string({ error: requiredError }),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

interface StepConfirmFormValue {
    code: string;
}

const StepConfirm = ({ open, setOpen, dispatch, refetch }: StepConfirmProps) => {
    const { t } = useTranslation('leads');
    const resolver = useFormSchema();
    const form = useForm<StepConfirmFormValue>({ resolver });
    const { handleSubmit, formState, setError } = form;

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: StepConfirmFormValue) => {
            const mutation = await apolloClient.mutate<
                EnableAuthenticatorMutation,
                EnableAuthenticatorMutationVariables
            >({
                mutation: EnableAuthenticatorDocument,
                variables: {
                    token: values.code,
                },
            });

            const response = mutation.data!.enableAuthenticator;
            if (response.__typename === 'EnableAuthenticatorSuccessfulResponse') {
                notifications.success({ message: t('profile:sections.2fa.enableSuccessful') });
                refetch();
                dispatch({ type: 'reset' });

                return;
            }

            if (response.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            // display the error message
            response.fields?.forEach(error => {
                setError(error.field as any, { type: 'backend', message: error.message });
            });
        },
        [apolloClient, t, setError, refetch, dispatch]
    );

    return (
        <Modal
            className="sm:!w-96"
            dataCy="otpStepConfirmModal"
            footer={
                <div className="mt-5 justify-between sm:mt-4 sm:flex sm:flex-row">
                    <Button onClick={() => dispatch({ type: 'goScan' })}>
                        {t(`profile:sections.2fa.stepConfirm.back`)}
                    </Button>
                    <div className="sm:flex sm:flex-row-reverse">
                        <Button
                            className="ml-3"
                            color="primary"
                            disabled={formState.isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                        >
                            {t(`profile:sections.2fa.stepConfirm.verify`)}
                        </Button>
                        <Button className="ml-3" onClick={() => setOpen(false)}>
                            {t('common:modal.cancel')}
                        </Button>
                    </div>
                </div>
            }
            onClose={() => setOpen(false)}
            open={open}
            title={t('profile:sections.2fa.stepConfirm.title')}
        >
            <Space direction="vertical">
                <div className="text-sm text-black">{t('profile:sections.2fa.stepConfirm.text')}</div>
                <FormProvider {...form}>
                    <form data-cy="otpStepConfirmForm">
                        <InputField
                            maxLength={6}
                            name="code"
                            placeholder={t('profile:sections.2fa.stepConfirm.placeholder')}
                        />
                    </form>
                </FormProvider>
            </Space>
        </Modal>
    );
};

export default StepConfirm;
