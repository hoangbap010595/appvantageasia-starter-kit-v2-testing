import { Cog8ToothIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import RedirectTo from '@/RedirectTo';
import useAbilities from '@/abilities';
import Avatar from '@/components/common/Avatar';
import Typography from '@/components/common/Typography';
import CardLayout from '@/components/layouts/CardLayout';
import { useUser } from '@/contexts/UserSession';
import getTenantColor from '@/utils/getTenantColor';
import getTenantInitials from '@/utils/getTenantInitials';

const GatewayPage = () => {
    const { t } = useTranslation('common');
    const user = useUser(true);
    const abilities = useAbilities();
    const navigate = useNavigate();

    if (user.memberships.length === 0 && abilities.canManageSystem) {
        return <RedirectTo to="/_system" />;
    }

    return (
        <CardLayout>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Typography as="h2" className="mb-6 text-center tracking-tight">
                    {t('common:misc.gatewayTitle')}
                </Typography>
                <div className="max-h-64 space-y-2 overflow-y-auto py-2">
                    {user.memberships.map(({ tenant, role }) => (
                        <button
                            key={tenant.id}
                            onClick={() => navigate(`/${tenant.slug.toLowerCase()}/`)}
                            className="group flex w-full items-center rounded-lg p-3 transition-all duration-200 hover:bg-pink-50 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                                <Avatar
                                    slot="icon"
                                    initials={getTenantInitials(tenant.name)}
                                    className={getTenantColor(tenant.name)}
                                />
                            </div>
                            <div className="ml-4 flex-grow text-left">
                                <div className="font-medium text-gray-900 group-hover:text-pink-700">{tenant.name}</div>
                                <div className="text-sm text-gray-500">{t(`common:roles.${role}`)}</div>
                            </div>
                        </button>
                    ))}
                </div>
                {abilities.canManageSystem && (
                    <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                        <button
                            onClick={() => navigate(`/_system/`)}
                            className="group flex w-full cursor-pointer items-center rounded-lg p-3 text-left transition-all duration-200 hover:bg-pink-50 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center group-hover:text-pink-700">
                                <Cog8ToothIcon className="size-6" />
                            </div>
                            <div className="ml-4">
                                <div className="font-medium text-gray-900 group-hover:text-pink-700">
                                    {t('common:navigation.manageSystem')}
                                </div>
                                <div className="text-sm text-gray-500">{t('common:roles.superAdmin')}</div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </CardLayout>
    );
};

export default GatewayPage;
