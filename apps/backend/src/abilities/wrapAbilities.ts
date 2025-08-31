import type { TenantDocument } from '@appvantageasia/core-tenants';
import type { UserDocument } from '@appvantageasia/core-users';
import type { MongoAbility } from '@casl/ability';

export interface WrappedAbilities {
    casl: MongoAbility;
    canManageUsers: () => boolean;
    canReadUserSensitiveData: (user: UserDocument) => boolean;
    canUpdateUserSensitiveData: (user: UserDocument) => boolean;
    canManageSystem: () => boolean;
    canReadTenant: (tenant: TenantDocument) => boolean;
    canManageTenant: (tenant: TenantDocument) => boolean;
}

const wrapAbilities = (abilities: MongoAbility): WrappedAbilities => {
    const wrappedAbilities: WrappedAbilities = {
        // Castle (CASL) ability object
        casl: abilities,

        // can the signed user manage users in the current organization
        canManageUsers: () => abilities.can('manage', 'User'),

        // can the signed user read sensitive data of the given user
        canReadUserSensitiveData: user => abilities.can('readSensitive', user),

        // can the signed user update sensitive data of the given user
        canUpdateUserSensitiveData: user => abilities.can('updateSensitive', user),

        // can the signed user update the system
        canManageSystem: () => abilities.can('manage', 'System'),

        // can the signed user read the tenant
        canReadTenant: (tenant: TenantDocument) => abilities.can('read', tenant),

        // can the signed user manage the tenant
        canManageTenant: (tenant: TenantDocument) => abilities.can('manage', tenant),
    };

    return wrappedAbilities;
};

export default wrapAbilities;
