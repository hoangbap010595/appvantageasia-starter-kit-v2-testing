export const show = (notification: Omit<NotificationItem, 'id'> & { id?: NotificationItem['id'] }): void => {
    const { dispatch } = window.notifications!;
    dispatch!({ type: 'add', notification });
};

export const remove = (notificationId: NotificationItem['id']): void => {
    const { dispatch } = window.notifications!;
    dispatch!({ type: 'remove', notificationId });
};

export type NotificationOptions = Pick<NotificationItem, 'message' | 'description' | 'duration'>;

export const success = (options: NotificationOptions) =>
    show({
        type: 'success',
        message: options.message,
        description: options.description,
        duration: options.duration || 5000, // default timeout of 5s
    });

export const error = (options: NotificationOptions) =>
    show({
        type: 'error',
        message: options.message,
        description: options.description,
        duration: options.duration, // no default timeout
    });

export const warning = (options: NotificationOptions) =>
    show({
        type: 'warning',
        message: options.message,
        description: options.description,
        duration: options.duration || 5000, // default timeout of 5s
    });

export const info = (options: NotificationOptions) =>
    show({
        type: 'info',
        message: options.message,
        description: options.description,
        duration: options.duration || 10000, // default timeout of 10s
    });
