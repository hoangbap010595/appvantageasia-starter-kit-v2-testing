import { ArrowRightStartOnRectangleIcon, UserIcon } from '@heroicons/react/16/solid';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import GenericNavBar from '@/components/blocks/GenericNavBar';
import { DropdownDivider, DropdownItem, DropdownLabel } from '@/components/common/Dropdown';
import { NavbarItem } from '@/components/common/NavBar';

const TenantNavBar = () => {
    const { t } = useTranslation('common');

    const makeSystemLink = (path: string) => `/_system/${path}`;

    const mainMenuItems = (
        <>
            <NavbarItem key="home" to={makeSystemLink('')}>
                {t('common:navigation.home')}
            </NavbarItem>
        </>
    );

    const userMenuItems: ReactNode[] = [
        <DropdownItem to={makeSystemLink('profile')} key="profile">
            <UserIcon />
            <DropdownLabel>{t('common:navigation.profile')}</DropdownLabel>
        </DropdownItem>,
    ];

    userMenuItems.push(
        <DropdownDivider key="end-divider" />,
        <DropdownItem to={makeSystemLink('signout')} key="logout">
            <ArrowRightStartOnRectangleIcon />
            <DropdownLabel>{t('common:navigation.signOut')}</DropdownLabel>
        </DropdownItem>
    );

    return <GenericNavBar mainMenuItems={mainMenuItems} userMenuItems={userMenuItems} />;
};

export default TenantNavBar;
