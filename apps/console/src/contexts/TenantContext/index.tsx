import type { ReactNode } from 'react';
import { useMemo, createContext, useContext } from 'react';
import { useParams } from 'react-router';
import NotFound from '@/components/blocks/NotFound';
import { useUser, type ContextValue } from '@/contexts/UserSession';

type Membership = NonNullable<ContextValue['user']>['memberships'][number];

export type Tenant = Membership['tenant'] & Pick<Membership, 'role'>;

export const Context = createContext<Tenant | null>(null);

export function useTenant(shouldThrowIfNull: true): Tenant;
export function useTenant(shouldThrowIfNull: false | undefined): Tenant | null;
export function useTenant(shouldThrowIfNull?: boolean): Tenant | null;
export function useTenant(shouldThrowIfNull = false): Tenant | null {
    const tenant = useContext(Context);

    if (shouldThrowIfNull && !tenant) {
        throw new Error('Tenant is not available');
    }

    return tenant;
}

export interface TenantContextProviderProps {
    children: ReactNode;
}

const TenantContextProvider = ({ children }: TenantContextProviderProps) => {
    const { tenantSlug } = useParams();
    const user = useUser(true);

    const tenant = useMemo(() => {
        if (!tenantSlug) {
            return null;
        }

        const membership = user.memberships.find(
            membership => membership.tenant.slug.toLowerCase() === tenantSlug.toLowerCase()
        );

        if (!membership) {
            return null;
        }

        return { ...membership.tenant, role: membership.role };
    }, [user, tenantSlug]);

    if (tenantSlug && !tenant) {
        return <NotFound homePath="/" centered />;
    }

    return <Context.Provider value={tenant}>{children}</Context.Provider>;
};

export default TenantContextProvider;
