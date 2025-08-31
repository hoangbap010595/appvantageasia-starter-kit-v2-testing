/// <reference path="../../types/notifications.d.ts" />
import { useReducer } from 'react';

const reducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'add': {
            const { notification } = action;

            let originalNotifications = state.notifications;

            if (notification.id) {
                // look for a replacement instead
                const isUpdate = state.notifications.some(notification => notification.id === action.notification.id);

                if (isUpdate) {
                    originalNotifications = state.notifications.filter(item => notification.id !== item.id);
                }
            }

            // dynamically compute the ID if not provide
            const id =
                notification.id ||
                Math.max(
                    ...state.notifications.map(notification =>
                        typeof notification.id === 'number' ? notification.id : -1
                    ),
                    0
                ) + 1;

            // add it as a new notification
            return {
                ...state,
                notifications: [
                    ...originalNotifications,
                    {
                        duration: 5000,
                        ...action.notification,
                        id,
                    },
                ],
            };
        }

        case 'remove':
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.notificationId),
            };

        default:
            return state;
    }
};

// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const useNotificationState = () => useReducer(reducer, window.notifications?.latestState!);

export default useNotificationState;
