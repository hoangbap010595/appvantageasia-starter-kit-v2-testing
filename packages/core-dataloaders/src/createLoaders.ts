import createTenantLoaders from './loaders/tenants.js';
import createUserLoaders from './loaders/users.js';

export const createLoaders = () => ({
    ...createUserLoaders(),
    ...createTenantLoaders(),
});

export type Loaders = ReturnType<typeof createLoaders>;
