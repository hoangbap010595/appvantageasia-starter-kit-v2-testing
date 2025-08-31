import type { CurrentUserFragment } from '@/contexts/UserSession/Usersession.api';

class UserAbilities {
    private user: CurrentUserFragment;

    constructor(user: CurrentUserFragment) {
        this.user = user;
    }

    get canManageSystem() {
        return this.user.isSuperAdmin;
    }
}

export default UserAbilities;
