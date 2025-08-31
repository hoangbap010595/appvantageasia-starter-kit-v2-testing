import { useMemo } from 'react';
import UserAbilities from './UserAbilities';
import { useUser } from '@/contexts/UserSession';

const useAbilities = () => {
    const user = useUser(true);

    return useMemo(() => new UserAbilities(user), [user]);
};

export default useAbilities;
