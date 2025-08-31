/// <reference path="../../types/notifications.d.ts" />
import type { AnimatedComponent } from '@react-spring/web';
import { useTransition, animated } from '@react-spring/web';
import * as Sentry from '@sentry/react';
import NotificationElement from './NotificationElement';
import useNotificationState from './useNotificationState';

// somehow using `animated.div` directly is seen as AnimatedComponent<string>
// without the literal tag `div`, React types are not able to infer the correct props type
const AnimatedDiv = animated.div as AnimatedComponent<'div'>;

const NotificationManager = () => {
    if (!window.notifications) {
        throw new Error('Notification global variable is not initialized');
    }

    const [state, dispatch] = useNotificationState();

    // update the singletone variables
    window.notifications.dispatch = dispatch;
    window.notifications.latestState = state;

    const transitions = useTransition(state.notifications, {
        keys: item => item.id,
        from: { opacity: 0, transform: 'translate(100%,0)' },
        enter: { opacity: 1, transform: 'translate(0%,0)' },
        leave: { opacity: 0, transform: 'translate(100%,0)' },
        config: { duration: 500 },
    });

    return (
        <div
            // aria-live="assertive"
            className="flex w-full flex-col items-center space-y-4 sm:items-end"
        >
            {transitions((style, item) => (
                <AnimatedDiv className="w-full max-w-sm" style={style}>
                    <NotificationElement dispatch={dispatch} notification={item} />
                </AnimatedDiv>
            ))}
        </div>
    );
};

export default Sentry.withProfiler(NotificationManager, { name: 'NotificationManager' });
