import { useUser } from '@/contexts/UserSession';
import AuthenticatedRoutes from '@/routes/AuthenticatedRoutes';
import UnauthenticatedRoutes from '@/routes/UnauthenticatedRoutes';

const AppRoutes = () => {
    const user = useUser();

    if (!user) {
        return <UnauthenticatedRoutes />;
    }

    return <AuthenticatedRoutes />;
};

export default AppRoutes;
