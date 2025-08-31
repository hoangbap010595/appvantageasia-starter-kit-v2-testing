import { useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router';
import { useUserSession } from '@/contexts/UserSession';

const SignOutPage = () => {
    const navigate = useNavigate();
    const { logout } = useUserSession();

    useEffect(() => {
        startTransition(() => {
            logout();
        });
    }, [navigate, logout]);

    return null;
};

export default SignOutPage;
