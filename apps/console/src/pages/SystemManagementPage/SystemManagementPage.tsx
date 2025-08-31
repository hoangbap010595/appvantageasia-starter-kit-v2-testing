import { useMemo, Suspense, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SSOSettings from './SSOSettings';
import useAbilities from '@/abilities';
import NotFound from '@/components/blocks/NotFound';
import Loader from '@/components/common/Loader';
import Space from '@/components/common/Space';
import Tab from '@/components/common/Tab';
import makeUseTabs from '@/components/common/Tab/makeUseTabs';
import AuditTrail from '@/pages/SystemManagementPage/AuditTrail';

enum SystemTab {
    SSO = 'sso',
    Trail = 'trail',
}

const useTabs = makeUseTabs(() => {
    const { t } = useTranslation('system');

    return useMemo(
        () => [
            { name: t('system:tabs.auditTrail'), key: SystemTab.Trail },
            { name: t('system:tabs.sso'), key: SystemTab.SSO },
        ],
        [t]
    );
}, false);

const SystemManagementPage = () => {
    const { t } = useTranslation('system');
    const { tabs, activeTab, onTabChange } = useTabs();
    const abilities = useAbilities();

    useLayoutEffect(() => {
        // since this page is rendered we can preload the tabs
        // by doing so, browsing to another tab will be more smooth
        // but we still enjoy optimization from code splitting
        SSOSettings.preload();
    }, []);

    // ensure the user is an admin to access this page
    // otherwise display 404 to avoid giving the information on the path
    if (!abilities.canManageSystem) {
        return <NotFound />;
    }

    return (
        <>
            <h1 className="text-lg leading-6 font-semibold text-black">{t('system:title')}</h1>
            <Space direction="vertical" className="mt-4">
                <Tab onChange={onTabChange} tabs={tabs} />
                <Suspense fallback={<Loader />}>
                    {activeTab === SystemTab.SSO && <SSOSettings />}
                    {activeTab === SystemTab.Trail && <AuditTrail />}
                </Suspense>
            </Space>
        </>
    );
};

export default SystemManagementPage;
