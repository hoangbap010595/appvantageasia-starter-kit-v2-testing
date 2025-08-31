import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import type { Dispatch } from 'react';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { VerifyOtpMutation, VerifyOtpMutationVariables } from './VerifyOtp.api';
import { VerifyOtpDocument } from './VerifyOtp.api';
import type { Action } from './useStep';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import type { ModalProps } from '@/components/common/Modal';
import Space from '@/components/common/Space';
import InputField from '@/components/fields/InputField';

type StepVerifyProps = Pick<ModalProps, 'open'> & {
    dispatch: Dispatch<Action>;
    newEmail: string;
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

interface StepVerifyFormValue {
    code: string;
}

const StepVerify = ({ open, setOpen, dispatch, newEmail }: StepVerifyProps) => {
    const { t } = useTranslation('leads');
    const resolver = useFormSchema();
    const form = useForm<StepVerifyFormValue>({ resolver });
    const { handleSubmit, formState } = form;

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: StepVerifyFormValue) => {
            const mutation = await apolloClient.mutate<VerifyOtpMutation, VerifyOtpMutationVariables>({
                mutation: VerifyOtpDocument,
                variables: { code: values.code, newEmail },
            });

            const response = mutation.data!.verifyOtp;
            if (response.__typename === 'VerifyOtpSuccessfulResponse') {
                dispatch({ type: 'goConfirm' });

                return;
            }

            if (response.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            // display the error message
            response.fields?.forEach(error => {
                form.setError(error.field as any, { type: 'backend', message: error.message });
            });
        },
        [dispatch, apolloClient, form, newEmail]
    );

    return (
        <Modal
            className="sm:!w-96"
            dataCy="stepVerifyModal"
            okDisabled={formState.isSubmitting}
            okText={t(`profile:updateEmail.stepVerify.${formState.isSubmitting ? 'continuing' : 'continue'}`)}
            onClose={() => setOpen(false)}
            onOk={() => handleSubmit(onSubmit)()}
            open={open}
            title={t('profile:updateEmail.stepVerify.title')}
        >
            <Space direction="vertical">
                <div>
                    <span className="text-m font-medium">{newEmail}</span>
                    <Button plain onClick={() => dispatch({ type: 'goBackChange', email: newEmail })}>
                        {t('profile:updateEmail.stepVerify.change')}
                    </Button>
                </div>
                <div className="text-sm text-black">{t('profile:updateEmail.stepVerify.text')}</div>
                <FormProvider {...form}>
                    <form data-cy="stepVerifyForm">
                        <InputField label={t('profile:updateEmail.stepVerify.enterOtp')} maxLength={6} name="code" />
                    </form>
                </FormProvider>
            </Space>
        </Modal>
    );
};

export default StepVerify;
