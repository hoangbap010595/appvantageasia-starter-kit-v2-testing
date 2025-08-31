import { useSearchParams } from 'react-router';
import RequestNewPassword from './RequestNewPassword';
import ResetPassword from './ResetPassword';
import TokenExpired from './TokenExpired';
import TokenExpirationController from '@/components/TokenExpirationController';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const tokenExpiredFallback = <TokenExpired />;

    if (token) {
        return (
            <TokenExpirationController fallback={tokenExpiredFallback} token={token}>
                <ResetPassword token={token} />
            </TokenExpirationController>
        );
    }

    return <RequestNewPassword />;
};

export default ResetPasswordPage;
