import type { Dispatch } from 'react';
import type { Root } from 'react-dom/client';

declare global {
    interface ConfirmModalOptions {
        title: string;
        content?: string;
    }

    interface ConfirmModalItem extends ConfirmModalOptions {
        id: number;
        open: boolean;
        callbacks: {
            remove: () => void;
            onAccept: () => void;
            onReject: () => void;
        };
    }

    interface ConfirmModalState {
        modals: ConfirmModalItem[];
    }

    type ConfirmModalAction =
        | { type: 'add'; options: ModalOptions; resolve: (value: boolean) => void }
        | { type: 'remove'; modalId: number }
        | { type: 'close'; modalId: number };

    interface Window {
        confirmModals?: {
            root: Root;
            dispatch?: Dispatch<ConfirmModalAction>;
            latestState: ConfirmModalState;
        };
    }
}
