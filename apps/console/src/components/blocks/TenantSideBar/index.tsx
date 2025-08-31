import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import GenericSideBar from '@/components/blocks/GenericSideBar';
import { SidebarItem } from '@/components/common/Sidebar';
import { useTenant } from '@/contexts/TenantContext';

const TenantSideBar = () => {
    const tenant = useTenant(true);
    const { t } = useTranslation('common');

    const makeTenantLink = (path: string) => `/${tenant.slug}/${path}`;

    const menuItems: ReactNode = (
        <>
            <SidebarItem to={makeTenantLink('')}>{t('common:navigation.home')}</SidebarItem>
            <SidebarItem to={makeTenantLink('whatever')}>{t('common:navigation.404')}</SidebarItem>
        </>
    );

    return <GenericSideBar menuItems={menuItems} />;
};

export default TenantSideBar;
