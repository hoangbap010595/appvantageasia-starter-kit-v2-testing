import { ChevronDownIcon } from '@heroicons/react/16/solid';
import type { ReactNode } from 'react';
import ContextMenu from '@/components/blocks/ContextMenu';
import Avatar from '@/components/common/Avatar';
import { Dropdown, DropdownButton } from '@/components/common/Dropdown';
import {
    Sidebar,
    SidebarBody,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from '@/components/common/Sidebar';

const appvantageLogo = new URL('@/public/logo/square/black.svg', import.meta.url).href;

export interface GenericSideBarProps {
    menuItems: ReactNode;
}

const GenericSideBar = ({ menuItems }: GenericSideBarProps) => (
    <Sidebar>
        <SidebarHeader>
            <Dropdown>
                <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                    <Avatar src={appvantageLogo} />
                    <SidebarLabel>Appvantage</SidebarLabel>
                    <ChevronDownIcon />
                </DropdownButton>
                <ContextMenu />
            </Dropdown>
        </SidebarHeader>
        <SidebarBody>
            <SidebarSection>{menuItems}</SidebarSection>
        </SidebarBody>
    </Sidebar>
);

export default GenericSideBar;
