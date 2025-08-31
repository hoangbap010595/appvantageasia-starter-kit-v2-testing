import { useApolloClient } from '@apollo/client';
import { regexp } from '@appvantageasia/core-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import pick from 'lodash/fp/pick';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { ChangePasswordMutation, ChangePasswordMutationVariables } from './ChangePassword.api';
import { ChangePasswordDocument } from './ChangePassword.api';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import PasswordRequirement, { useValidatePassword } from '@/components/blocks/PasswordRequirement';
import Button from '@/components/common/Button';
import PasswordField from '@/components/fields/PasswordField';
import FormLayout from '@/components/layouts/FormLayout';
import * as notifications from '@/utils/notifications';

const createSchema = (t: TFunction) => {
    // create schema with zod
    const requiredError = t('common:formErrors.required');
    const invalidPassword = t('common:formErrors.invalidPassword');
    const passwordDoNotMatch = t('common:formErrors.passwordsDoNotMatch');

    return z
        .object({
            currentPassword: z.string({ error: requiredError }),
            newPassword: z
                .string({ error: requiredError })
                .min(8, { error: invalidPassword })
                .regex(regexp.password, { error: invalidPassword }),
            passwordRepeat: z.string({ error: requiredError }),
        })
        .required()
        .refine(data => data.newPassword === data.passwordRepeat, {
            error: passwordDoNotMatch,
            path: ['passwordRepeat'],
        });
};

type PasswordValues = z.infer<ReturnType<typeof createSchema>>;

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

const Password = () => {
    const { t } = useTranslation('profile');
    const resolver = useFormSchema();
    const form = useForm<PasswordValues>({ resolver });
    const { handleSubmit, formState, setError, reset } = form;

    const validatePassword = useValidatePassword();

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: PasswordValues) => {
            const mutation = await apolloClient.mutate<ChangePasswordMutation, ChangePasswordMutationVariables>({
                mutation: ChangePasswordDocument,
                variables: pick(['currentPassword', 'newPassword'], values),
            });

            const response = mutation.data!.changePassword;

            if (response.__typename === 'ChangePasswordSuccessfulResponse') {
                notifications.success({ message: t('profile:sections.password.updateSuccessful') });
                return reset();
            }

            if (response.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            // display the error message
            response.fields?.forEach(error => {
                setError(error.field as any, { type: 'backend', message: error.message });
            });
        },
        [apolloClient, reset, setError, t]
    );

    return (
        <FormProvider {...form}>
            <form data-cy="profilePasswordForm" onSubmit={handleSubmit(onSubmit)}>
                <FormLayout
                    actions={
                        <Button color="primary" disabled={formState.isSubmitting} type="submit">
                            {t(`profile:sections.password.${formState.isSubmitting ? 'updating' : 'update'}`)}
                        </Button>
                    }
                >
                    <FormSection
                        extra={<PasswordRequirement requirements={validatePassword(form.watch('newPassword'))} />}
                        title={t('profile:sections.password.title')}
                    >
                        <ColItem>
                            <PasswordField
                                {...t('profile:sections.password.fields.currentPassword', { returnObjects: true })}
                                name="currentPassword"
                            />
                        </ColItem>
                        <ColItem>
                            <PasswordField
                                {...t('profile:sections.password.fields.newPassword', { returnObjects: true })}
                                name="newPassword"
                            />
                        </ColItem>
                        <ColItem>
                            <PasswordField
                                {...t('profile:sections.password.fields.passwordRepeat', { returnObjects: true })}
                                name="passwordRepeat"
                            />
                        </ColItem>
                    </FormSection>
                </FormLayout>
            </form>
        </FormProvider>
    );
};

export default Password;
