import type { Dispatch, ReactNode } from 'react';
import type { Root } from 'react-dom/client';

declare global {
    interface NotificationItem {
        id: number | string;
        type: 'info' | 'success' | 'warning' | 'error';
        message?: ReactNode;
        description?: ReactNode;
        duration?: number;
    }

    interface NotificationState {
        notifications: NotificationItem[];
    }

    type NotificationAction =
        | { type: 'add'; notification: Omit<NotificationItem, 'id'> & { id?: NotificationItem['id'] } }
        | { type: 'remove'; notificationId: NotificationItem['id'] };

    interface Window {
        notifications?: {
            root: Root;
            dispatch?: Dispatch<NotificationAction>;
            latestState: NotificationState;
        };
    }
}
