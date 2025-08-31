/// <reference path="../../types/confirmModals.d.ts" />
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ConfirmModalManager from './ConfirmModalManager';

if (!window.confirmModals) {
    // create a container in the DOM for the confirm modals
    const container = document.createElement('div');
    document.body.appendChild(container);

    // render the confirm modal manager there
    const root = createRoot(container);

    window.confirmModals = {
        root,
        latestState: { modals: [] },
    };

    root.render(
        <I18nextProvider i18n={i18n}>
            <ConfirmModalManager />
        </I18nextProvider>
    );
}

// export API to play with notifications
export function confirm(options: ConfirmModalOptions, onConfirmation: () => any): void;
export function confirm(options: ConfirmModalOptions): Promise<boolean>;
export function confirm(options: ConfirmModalOptions, onConfirmation?: () => any) {
    const promise = new Promise<boolean>(resolve => {
        const { dispatch } = window.confirmModals!;

        if (!dispatch) {
            throw new Error('Confirm modals global variable is not initialized');
        }

        dispatch({ type: 'add', resolve, options });
    });

    if (onConfirmation) {
        promise.then(confirmation => {
            if (confirmation) {
                onConfirmation();
            }
        });

        return undefined;
    }

    return promise;
}
