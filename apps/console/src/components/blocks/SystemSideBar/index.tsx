import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import GenericSideBar from '@/components/blocks/GenericSideBar';
import { SidebarItem } from '@/components/common/Sidebar';

const SystemSideBar = () => {
    const { t } = useTranslation('common');

    const makeSystemLink = (path: string) => `/_system/${path}`;

    const menuItems: ReactNode = (
        <>
            <SidebarItem to={makeSystemLink('')}>{t('common:navigation.home')}</SidebarItem>
            <SidebarItem to={makeSystemLink('whatever')}>{t('common:navigation.404')}</SidebarItem>
        </>
    );

    return <GenericSideBar menuItems={menuItems} />;
};

export default SystemSideBar;
