/// <reference path="../../types/notifications.d.ts" />
import { XMarkIcon } from '@heroicons/react/20/solid';
import {
    ExclamationTriangleIcon,
    XCircleIcon,
    CheckCircleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Dispatch } from 'react';
import { useCallback, useEffect } from 'react';
import { remove } from './actions';
import Button from '@/components/common/Button';

export interface NotificationElementProps {
    notification: NotificationItem;
    dispatch: Dispatch<NotificationAction>;
}

const NotificationElement = ({ notification, dispatch }: NotificationElementProps) => {
    useEffect(() => {
        if (!notification.duration) {
            // do nothing
            return () => undefined;
        }

        let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
            timeoutId = null;
            dispatch({ type: 'remove', notificationId: notification.id });
        }, notification.duration);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [dispatch, notification]);

    const onClose = useCallback(() => remove(notification.id), [notification.id]);

    return (
        <div className="ring-opacity-5 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black transition data-[closed]:opacity-0 data-[enter]:transform data-[enter]:duration-300 data-[enter]:ease-out data-[closed]:data-[enter]:translate-y-2 data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
            <div className="p-4" data-cy="notification">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {notification.type === 'warning' && (
                            <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-yellow-400" />
                        )}
                        {notification.type === 'error' && (
                            <XCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
                        )}
                        {notification.type === 'success' && (
                            <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
                        )}
                        {notification.type === 'info' && (
                            <InformationCircleIcon aria-hidden="true" className="h-6 w-6 text-blue-400" />
                        )}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="mt-1 text-sm text-gray-500">{notification.description}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <Button className="!p-0 !text-gray-400" plain onClick={onClose}>
                            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationElement;
