import { useSubscribeEventFromConsoleSessionSubscription } from './SubscribeEventFromConsoleSession.api';
import { useSubscribeEventFromUserSessionSubscription } from './SubscribeEventFromUserSession.api';
import handler from './handlers';
import { useUserSession } from '@/contexts/UserSession';
import runtime from '@/runtime';

const SubscriptionManager = () => {
    const { token: userSessionToken } = useUserSession();

    useSubscribeEventFromConsoleSessionSubscription({
        variables: { token: runtime.session },
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        onData: options => handler(options.data?.data?.eventFromConsoleSession!),
    });

    useSubscribeEventFromUserSessionSubscription({
        variables: { token: userSessionToken! },
        skip: !userSessionToken,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        onData: options => handler(options.data?.data?.eventFromUserSession!),
    });

    return null;
};

export default SubscriptionManager;
