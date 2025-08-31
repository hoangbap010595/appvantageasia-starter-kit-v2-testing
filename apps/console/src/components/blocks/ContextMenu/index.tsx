import { PlusIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/common/Avatar';
import { DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/common/Dropdown';
import { useUser } from '@/contexts/UserSession';
import getTenantColor from '@/utils/getTenantColor';
import getTenantInitials from '@/utils/getTenantInitials';

const ContextMenu = () => {
    const { t } = useTranslation('common');
    const { memberships } = useUser(true);

    return (
        <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
            {memberships.map(membership => (
                <DropdownItem to={`/${membership.tenant.slug.toLowerCase()}/`} key={membership.tenant.id}>
                    <Avatar
                        slot="icon"
                        initials={getTenantInitials(membership.tenant.name)}
                        className={getTenantColor(membership.tenant.name)}
                    />
                    <DropdownLabel>Other Context</DropdownLabel>
                </DropdownItem>
            ))}
            {memberships.length > 0 && <DropdownDivider />}
            <DropdownItem to="/newTenant">
                <PlusIcon />
                <DropdownLabel>{t('common:navigation.newTenant')}</DropdownLabel>
            </DropdownItem>
        </DropdownMenu>
    );
};

export default ContextMenu;
