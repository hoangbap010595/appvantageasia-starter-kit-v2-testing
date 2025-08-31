/// <reference path="../../types/notifications.d.ts" />
import { createRoot } from 'react-dom/client';
import NotificationManager from './NotificationManager';

if (!window.notifications) {
    // create a container in the DOM for the notifications
    const container = document.createElement('div');
    container.className =
        'pointer-events-none w-full fixed z-50 top-0 right-0 flex items-end px-4 py-6 sm:items-start sm:p-6';
    container.ariaLive = 'assertive';
    document.body.appendChild(container);

    // render the notification manager there
    const root = createRoot(container);

    window.notifications = {
        root,
        latestState: { notifications: [] },
    };

    root.render(<NotificationManager />);
}

// export API to play with notifications
export * from './actions';
