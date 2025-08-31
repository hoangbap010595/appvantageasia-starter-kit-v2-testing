import { useMemo, Suspense, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchProfileQuery } from './FetchProfile.api';
import MainDetails from './MainDetails';
import Password from './Password';
import TwoFactor from './TwoFactor';
import UserSessions from './UserSessions';
import NotFound from '@/components/blocks/NotFound';
import Loader from '@/components/common/Loader';
import Space from '@/components/common/Space';
import Tab from '@/components/common/Tab';
import makeUseTabs from '@/components/common/Tab/makeUseTabs';

enum ProfileTab {
    MainDetails = 'MainDetail',
    Password = 'Password',
    TwoFactorAuthentication = 'TwoFactorAuthentication',
    Sessions = 'Sessions',
}

const useTabs = makeUseTabs(() => {
    const { t } = useTranslation('profile');

    return useMemo(
        () => [
            { name: t('profile:tabs.mainDetails'), key: ProfileTab.MainDetails },
            { name: t('profile:tabs.password'), key: ProfileTab.Password },
            { name: t('profile:tabs.twoFactorAuthentication'), key: ProfileTab.TwoFactorAuthentication },
            { name: t('profile:tabs.sessions'), key: ProfileTab.Sessions },
        ],
        [t]
    );
}, false);

const ProfilePage = () => {
    const { t } = useTranslation('profile');
    const { tabs, activeTab, onTabChange } = useTabs();

    const { data, loading, refetch } = useFetchProfileQuery({ fetchPolicy: 'cache-and-network' });

    const profile = data?.profile;

    useLayoutEffect(() => {
        // since this page is rendered we can preload the tabs
        // by doing so, browsing to another tab will be more smooth
        // but we still enjoy optimization from code splitting
        Password.preload();
        UserSessions.preload();
        TwoFactor.preload();
    }, []);

    if (!profile && loading) {
        return <Loader />;
    }

    if (!profile) {
        return <NotFound />;
    }

    return (
        <>
            <h1 className="text-lg leading-6 font-semibold text-black">{t('profile:title')}</h1>
            <Space direction="vertical" className="mt-4">
                <Tab onChange={onTabChange} tabs={tabs} />
                <Suspense fallback={<Loader />}>
                    {activeTab === ProfileTab.MainDetails && <MainDetails profile={profile} refetch={refetch} />}
                    {activeTab === ProfileTab.Password && <Password />}
                    {activeTab === ProfileTab.TwoFactorAuthentication && (
                        <TwoFactor profile={profile} refetch={refetch} />
                    )}
                    {activeTab === ProfileTab.Sessions && <UserSessions profile={profile} />}
                </Suspense>
            </Space>
        </>
    );
};

export default ProfilePage;
