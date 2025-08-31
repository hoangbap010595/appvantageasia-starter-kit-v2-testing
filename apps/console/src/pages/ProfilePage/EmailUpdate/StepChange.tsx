import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import type { Dispatch } from 'react';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { ProfileDataFragment } from '../FetchProfile.api';
import type { ChangeEmailMutation, ChangeEmailMutationVariables } from './ChangeEmail.api';
import { ChangeEmailDocument } from './ChangeEmail.api';
import type { Action } from './useStep';
import Modal from '@/components/common/Modal';
import type { ModalProps } from '@/components/common/Modal';
import Space from '@/components/common/Space';
import InputField from '@/components/fields/InputField';

type StepChangeProps = Pick<ModalProps, 'open'> & {
    profile: ProfileDataFragment;
    dispatch: Dispatch<Action>;
    newEmail: string;
    setOpen: (state: boolean) => void;
};

const createSchema = (T: TFunction) => {
    const requiredError = T('common:formErrors.required');
    const invalidEmailError = T('common:formErrors.invalidEmail');

    return z
        .object({
            newEmail: z.string({ error: requiredError }).email(invalidEmailError),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

interface StepChangeFormValue {
    newEmail: string;
}

const StepChange = ({ open, setOpen, profile, dispatch, newEmail }: StepChangeProps) => {
    const { t } = useTranslation('leads');
    const resolver = useFormSchema();
    const form = useForm<StepChangeFormValue>({ resolver, defaultValues: { newEmail } });
    const { handleSubmit, formState } = form;

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: StepChangeFormValue) => {
            const mutation = await apolloClient.mutate<ChangeEmailMutation, ChangeEmailMutationVariables>({
                mutation: ChangeEmailDocument,
                variables: values,
            });

            const response = mutation.data!.changeEmail;
            if (response.__typename === 'ChangeEmailSuccessfulResponse') {
                dispatch({ type: 'goVerify', email: values.newEmail });

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
        [dispatch, apolloClient, form]
    );

    return (
        <Modal
            className="sm:!w-96"
            dataCy="stepChangeModal"
            okDisabled={formState.isSubmitting}
            okText={t(`profile:updateEmail.stepChange.${formState.isSubmitting ? 'continuing' : 'continue'}`)}
            onClose={() => setOpen(false)}
            onOk={() => handleSubmit(onSubmit)()}
            open={open}
            title={t('profile:updateEmail.stepChange.title')}
        >
            <Space direction="vertical">
                <div className="flex flex-col">
                    <span className="text-sm text-black">{t('profile:updateEmail.stepChange.currentEmail')}</span>
                    <span className="text-m font-medium">{profile.email}</span>
                </div>
                <div className="text-sm text-black">{t('profile:updateEmail.stepChange.text')}</div>
                <FormProvider {...form}>
                    <form data-cy="stepChangeForm">
                        <InputField label={t('profile:updateEmail.stepChange.newEmailAddress')} name="newEmail" />
                    </form>
                </FormProvider>
            </Space>
        </Modal>
    );
};

export default StepChange;
