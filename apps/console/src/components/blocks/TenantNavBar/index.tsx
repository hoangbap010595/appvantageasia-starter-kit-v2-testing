import { ArrowRightStartOnRectangleIcon, UserIcon, Cog8ToothIcon } from '@heroicons/react/16/solid';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useAbilities from '@/abilities';
import GenericNavBar from '@/components/blocks/GenericNavBar';
import { DropdownDivider, DropdownItem, DropdownLabel } from '@/components/common/Dropdown';
import { NavbarItem } from '@/components/common/NavBar';
import { useTenant } from '@/contexts/TenantContext';

const TenantNavBar = () => {
    const tenant = useTenant(true);
    const { t } = useTranslation('common');
    const abilities = useAbilities();

    const makeTenantLink = (path: string) => `/${tenant.slug}/${path}`;

    const mainMenuItems = (
        <>
            <NavbarItem key="home" to={makeTenantLink('')}>
                {t('common:navigation.home')}
            </NavbarItem>
            <NavbarItem key="404" to={makeTenantLink('whatever')}>
                {t('common:navigation.404')}
            </NavbarItem>
        </>
    );

    const userMenuItems: ReactNode[] = [
        <DropdownItem to={makeTenantLink('profile')} key="profile">
            <UserIcon />
            <DropdownLabel>{t('common:navigation.profile')}</DropdownLabel>
        </DropdownItem>,
    ];

    if (abilities.canManageSystem) {
        userMenuItems.push(
            <DropdownItem to="/_system" key="system">
                <Cog8ToothIcon />
                <DropdownLabel>{t('common:navigation.system')}</DropdownLabel>
            </DropdownItem>
        );
    }

    userMenuItems.push(
        <DropdownDivider key="end-divider" />,
        <DropdownItem to={makeTenantLink('signout')} key="logout">
            <ArrowRightStartOnRectangleIcon />
            <DropdownLabel>{t('common:navigation.signOut')}</DropdownLabel>
        </DropdownItem>
    );

    return <GenericNavBar mainMenuItems={mainMenuItems} userMenuItems={userMenuItems} />;
};

export default TenantNavBar;
