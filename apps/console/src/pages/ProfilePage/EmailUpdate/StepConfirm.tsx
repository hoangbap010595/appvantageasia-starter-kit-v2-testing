import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import type { Dispatch } from 'react';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { ProfileDataFragment } from '../FetchProfile.api';
import type { ConfirmEmailMutation, ConfirmEmailMutationVariables } from './ConfirmEmail.api';
import { ConfirmEmailDocument } from './ConfirmEmail.api';
import type { Action } from './useStep';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import type { ModalProps } from '@/components/common/Modal';
import Space from '@/components/common/Space';
import PasswordField from '@/components/fields/PasswordField';
import * as notifications from '@/utils/notifications';

type StepConfirmProps = Pick<ModalProps, 'open'> & {
    profile: ProfileDataFragment;
    dispatch: Dispatch<Action>;
    newEmail: string;
    refetch: () => unknown;
    setOpen: (state: boolean) => void;
};

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            password: z.string({ error: requiredError }),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

interface StepConfirmFormValue {
    password: string;
}

const StepConfirm = ({ open, setOpen, profile, dispatch, newEmail, refetch }: StepConfirmProps) => {
    const { t } = useTranslation('leads');
    const resolver = useFormSchema();
    const form = useForm<StepConfirmFormValue>({ resolver });
    const { handleSubmit, formState } = form;

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: StepConfirmFormValue) => {
            const mutation = await apolloClient.mutate<ConfirmEmailMutation, ConfirmEmailMutationVariables>({
                mutation: ConfirmEmailDocument,
                variables: { password: values.password, newEmail },
            });

            const response = mutation.data!.confirmEmail;
            if (response.__typename === 'ConfirmEmailSuccessfulResponse') {
                dispatch({ type: 'reset' });
                refetch();

                notifications.success({ message: t('profile:updateEmail.updateSuccessful') });

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
        [dispatch, apolloClient, form, newEmail, refetch, t]
    );

    return (
        <Modal
            className="sm:!w-96"
            dataCy="stepConfirmModal"
            okDisabled={formState.isSubmitting}
            okText={t(`profile:updateEmail.stepConfirm.${formState.isSubmitting ? 'updating' : 'update'}`)}
            onClose={() => setOpen(false)}
            onOk={() => handleSubmit(onSubmit)()}
            open={open}
            title={t('profile:updateEmail.stepConfirm.title')}
        >
            <Space direction="vertical">
                <div className="text-sm text-black">{t('profile:updateEmail.stepConfirm.text')}</div>
                <div className="flex flex-col">
                    <span className="text-sm text-black">
                        {t('profile:updateEmail.stepConfirm.previousEmailAddress')}
                    </span>
                    <span className="text-m font-medium">{profile.email}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-black">{t('profile:updateEmail.stepConfirm.newEmailAddress')}</span>
                    <div>
                        <span className="text-m font-medium">{newEmail}</span>
                        <Button
                            className="!py-0"
                            plain
                            onClick={() => dispatch({ type: 'goBackChange', email: newEmail })}
                        >
                            {t('profile:updateEmail.stepConfirm.change')}
                        </Button>
                    </div>
                </div>
                <FormProvider {...form}>
                    <form data-cy="stepConfirmForm">
                        <PasswordField label={t('profile:updateEmail.stepConfirm.password')} name="password" />
                    </form>
                </FormProvider>
            </Space>
        </Modal>
    );
};

export default StepConfirm;
