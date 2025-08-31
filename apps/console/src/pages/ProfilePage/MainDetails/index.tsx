import { useApolloClient } from '@apollo/client';
import { regexp } from '@appvantageasia/core-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import pick from 'lodash/fp/pick';
import { useCallback, useEffect, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmailUpdate from '../EmailUpdate';
import type { ProfileDataFragment } from '../FetchProfile.api';
import type { UpdateProfileMutation, UpdateProfileMutationVariables } from './UpdateProfile.api';
import { UpdateProfileDocument } from './UpdateProfile.api';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import Button from '@/components/common/Button';
import InputField from '@/components/fields/InputField';
import FormLayout from '@/components/layouts/FormLayout';
import * as notifications from '@/utils/notifications';

const useHasChanged = (profile: ProfileDataFragment, form: UseFormReturn<BaseInfoValues>) => {
    const { watch } = form;
    const newName = watch('name');

    return useMemo(() => profile.name !== newName, [profile.name, newName]);
};

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');
    const invalidNameError = t('common:formErrors.invalidName');
    const nameTooShortError = t('common:formErrors.nameTooShort');
    const nameTooLongError = t('common:formErrors.nameTooLong');
    const invalidEmail = t('common:formErrors.invalidEmail');

    return z
        .object({
            name: z
                .string({ error: requiredError })
                .min(2, { error: nameTooShortError })
                .max(50, { error: nameTooLongError })
                .regex(regexp.name, { error: invalidNameError }),
            email: z.string({ error: requiredError }).email({ error: invalidEmail }),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

type BaseInfoValues = Pick<ProfileDataFragment, 'name' | 'email'>;

interface MainDetailsProps {
    profile: ProfileDataFragment;
    refetch: () => unknown;
}

const MainDetails = ({ profile, refetch }: MainDetailsProps) => {
    const { t } = useTranslation('profile');
    const resolver = useFormSchema();
    const form = useForm<BaseInfoValues>({ resolver, defaultValues: { email: profile.email, name: profile.name } });
    const { handleSubmit, formState, setValue, setError } = form;

    useEffect(() => {
        if (profile.email) {
            setValue('email', profile.email);
        }
    }, [setValue, profile.email]);

    const hasChanged = useHasChanged(profile, form);

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: BaseInfoValues) => {
            const mutation = await apolloClient.mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
                mutation: UpdateProfileDocument,
                variables: pick(['name'], values),
            });

            const response = mutation.data!.updateProfile;
            if (response.__typename === 'UpdateProfileSuccessfulResponse') {
                notifications.success({ message: t('profile:sections.mainDetails.updateSuccessful') });

                refetch();

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
        [apolloClient, t, refetch, setError]
    );

    return (
        <FormProvider {...form}>
            <form data-cy="profileMainDetailForm" onSubmit={handleSubmit(onSubmit)}>
                <FormLayout
                    actions={
                        <Button color="primary" disabled={formState.isSubmitting || !hasChanged} type="submit">
                            {t(`profile:sections.mainDetails.${formState.isSubmitting ? 'updating' : 'update'}`)}
                        </Button>
                    }
                >
                    <FormSection title={t('profile:sections.mainDetails.title')}>
                        <ColItem>
                            <InputField
                                {...t('profile:sections.mainDetails.fields.name', { returnObjects: true })}
                                name="name"
                            />
                        </ColItem>
                        <ColItem className="sm:col-span-4">
                            <EmailUpdate profile={profile} refetch={refetch} />
                        </ColItem>
                    </FormSection>
                </FormLayout>
            </form>
        </FormProvider>
    );
};

// we do not do lazy loading on main details as it is always loaded when the profile page is rendered
// so it wouldn't provide much optimization to do code splitting here
export default MainDetails;
