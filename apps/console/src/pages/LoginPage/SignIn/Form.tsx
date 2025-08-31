import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import MicrosoftButton from '../MSAL/MicrosoftButton';
import OIDCButton from '../OIDC/OIDCButton';
import Button from '@/components/common/Button';
import InputField from '@/components/fields/InputField';
import PasswordField from '@/components/fields/PasswordField';
import runtime from '@/runtime';

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            email: z.string({ error: requiredError }).email(t('common:formErrors.invalidEmail')),
            password: z.string({ error: requiredError }),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

export type InputValues = z.input<ReturnType<typeof createSchema>>;

export type OutputValues = z.output<ReturnType<typeof createSchema>>;

export const useSignInForm = (defaultValues?: Partial<SignInValues>) => {
    const resolver = useFormSchema();

    return useForm<InputValues, any, OutputValues>({ resolver, defaultValues });
};

export interface SignInValues {
    email: string;
    password: string;
}

interface SignInFormProps {
    onSubmit: SubmitHandler<SignInValues>;
}

const SignInForm = ({ onSubmit }: SignInFormProps) => {
    const { t } = useTranslation('loginPage');

    const form = useFormContext<SignInValues>();
    const { watch, formState, handleSubmit } = form;

    return (
        <form className="space-y-6" data-cy="signInForm" onSubmit={handleSubmit(onSubmit)}>
            <InputField
                {...t('loginPage:authenticateStep.fields.email', { returnObjects: true })}
                name="email"
                autoComplete="email"
            />
            <PasswordField
                {...t('loginPage:authenticateStep.fields.password', { returnObjects: true })}
                labelExtra={
                    <Link
                        className={`text-sm font-semibold text-pink-400 hover:text-pink-500`}
                        state={{ email: watch('email') }}
                        to="./resetPassword"
                    >
                        {t('loginPage:authenticateStep.forgotPasswordLink')}
                    </Link>
                }
                name="password"
                autoComplete="current-password"
            />
            <Button className="w-full" color="primary" disabled={formState.isSubmitting} type="submit">
                {t(`loginPage:authenticateStep.${formState.isSubmitting ? 'submitting' : 'submitBtn'}`)}
            </Button>
            {runtime.sso?.type === 'msal' && <MicrosoftButton disabled={formState.isSubmitting} />}
            {runtime.sso?.type === 'oidc' && <OIDCButton disabled={formState.isSubmitting} />}
        </form>
    );
};

export default SignInForm;
