import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/16/solid';
import type { ReactNode } from 'react';
import ContextMenu from '@/components/blocks/ContextMenu';
import ThemeModeSwitch from '@/components/blocks/ThemeModeSwitch';
import Avatar from '@/components/common/Avatar';
import { Dropdown, DropdownButton, DropdownMenu } from '@/components/common/Dropdown';
import {
    Navbar,
    NavbarDivider,
    NavbarItem,
    NavbarLabel,
    NavbarSection,
    NavbarSpacer,
} from '@/components/common/NavBar';

const appvantageLogo = new URL('@/public/logo/square/black.svg', import.meta.url).href;

export interface GenericNavBarProps {
    mainMenuItems: ReactNode;
    userMenuItems: ReactNode;
}

const GenericNavBar = ({ mainMenuItems, userMenuItems }: GenericNavBarProps) => (
    <Navbar>
        <Dropdown>
            <DropdownButton as={NavbarItem} className="max-lg:hidden">
                <Avatar src={appvantageLogo} />
                <NavbarLabel>Appvantage</NavbarLabel>
                <ChevronDownIcon />
            </DropdownButton>
            <ContextMenu />
        </Dropdown>
        <NavbarDivider className="max-lg:hidden" />
        <NavbarSection className="max-lg:hidden">{mainMenuItems}</NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
            <ThemeModeSwitch />
            <Dropdown>
                <DropdownButton as={NavbarItem}>
                    <UserCircleIcon />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                    {userMenuItems}
                </DropdownMenu>
            </Dropdown>
        </NavbarSection>
    </Navbar>
);

export default GenericNavBar;
