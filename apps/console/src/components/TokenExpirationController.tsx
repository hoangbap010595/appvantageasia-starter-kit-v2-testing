import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import useTokenExpiration from '@/utils/useTokenExpiration';

export interface TokenExpirationControllerProps {
    token: string;
    fallback: ReactNode;
    children: ReactNode;
}

const TokenExpirationController = ({ token, fallback, children }: TokenExpirationControllerProps) => {
    const [isExpired, setIsExpired] = useState(false);

    const callback = useCallback(() => setIsExpired(true), [setIsExpired]);

    useTokenExpiration(token, callback);

    if (isExpired) {
        return fallback;
    }

    return children;
};

export default TokenExpirationController;
