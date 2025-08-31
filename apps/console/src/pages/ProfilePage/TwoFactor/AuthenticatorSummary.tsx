import { useApolloClient } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileDataFragment } from '../FetchProfile.api';
import type { DisableAuthenticatorMutation, DisableAuthenticatorMutationVariables } from './DisableAuthenticator.api';
import { DisableAuthenticatorDocument } from './DisableAuthenticator.api';
import Button from '@/components/common/Button';
import { confirm } from '@/utils/ConfirmModal';
import * as notifications from '@/utils/notifications';
import useDateFormats from '@/utils/useDateFormats';

interface AuthenticatorSummaryProps {
    profile: ProfileDataFragment;
    refetch: () => unknown;
}

const AuthenticatorSummary = ({ profile, refetch }: AuthenticatorSummaryProps) => {
    const { t } = useTranslation('profile');
    const { formatDateTime } = useDateFormats();

    const apolloClient = useApolloClient();
    const onDelete = useCallback(() => {
        confirm(
            {
                title: t('profile:sections.2fa.deletionModal.title'),
                content: t(`profile:sections.2fa.deletionModal.content`),
            },
            async () => {
                await apolloClient.mutate<DisableAuthenticatorMutation, DisableAuthenticatorMutationVariables>({
                    mutation: DisableAuthenticatorDocument,
                });

                notifications.success({ message: t('profile:sections.2fa.disableSuccessful') });
                refetch();
            }
        );
    }, [apolloClient, refetch, t]);

    return (
        <div className="overflow-hidden rounded-lg bg-gray-50 sm:col-span-6">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <span className="mb-2">{t('profile:sections.2fa.authenticator')}</span>
                        <span className="text-xs text-gray-500">
                            {t('profile:sections.2fa.addedOn', {
                                time: formatDateTime(profile.otpAuthenticator!.date),
                            })}
                        </span>
                    </div>
                    <Button data-cy="disableOtpButton" plain onClick={onDelete} type="button">
                        <TrashIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AuthenticatorSummary;
