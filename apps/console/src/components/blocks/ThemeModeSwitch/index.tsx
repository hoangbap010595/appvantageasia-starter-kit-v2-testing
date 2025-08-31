import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/common/Dropdown';
import { NavbarItem } from '@/components/common/NavBar';
import { turnSystemMode, turnDarkMode, turnLightMode, useThemeMode } from '@/utils/darkMode';

const ThemeModeSwitch = () => {
    const { t } = useTranslation('common');
    const theme = useThemeMode();

    const getCurrentThemeIcon = () => {
        switch (theme) {
            case 'dark':
                return <MoonIcon />;

            case 'light':
                return <SunIcon />;

            case 'system':
                return <ComputerDesktopIcon />;
        }
    };

    return (
        <Dropdown>
            <DropdownButton as={NavbarItem} aria-label={t(`common:theme.${theme}`)}>
                {getCurrentThemeIcon()}
            </DropdownButton>
            <DropdownMenu className="w-auto" anchor="bottom end">
                <DropdownItem onClick={turnLightMode}>
                    <SunIcon />
                    <DropdownLabel>{t('common:theme.light')}</DropdownLabel>
                </DropdownItem>
                <DropdownItem onClick={turnDarkMode}>
                    <MoonIcon />
                    <DropdownLabel>{t('common:theme.dark')}</DropdownLabel>
                </DropdownItem>
                <DropdownItem onClick={turnSystemMode}>
                    <ComputerDesktopIcon />
                    <DropdownLabel>{t('common:theme.system')}</DropdownLabel>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default ThemeModeSwitch;
