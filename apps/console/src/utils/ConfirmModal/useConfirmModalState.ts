/// <reference path="../../types/confirmModals.d.ts" />
import type { Reducer } from 'react';
import { useReducer } from 'react';

const reducer: Reducer<ConfirmModalState, ConfirmModalAction> = (state, action) => {
    switch (action.type) {
        case 'add': {
            // dynamically compute the ID if not provide
            const id = Math.max(...state.modals.map(modal => modal.id), 0) + 1;

            const modal: ConfirmModalItem = {
                id,
                ...action.options,
                open: true,
                callbacks: {
                    remove: () => {
                        window.confirmModals!.dispatch!({ type: 'remove', modalId: id });
                    },
                    onReject: () => {
                        window.confirmModals!.dispatch!({ type: 'close', modalId: id });
                        action.resolve(false);
                    },
                    onAccept: () => {
                        window.confirmModals!.dispatch!({ type: 'close', modalId: id });
                        action.resolve(true);
                    },
                },
            };

            // add it as a new modal
            return { ...state, modals: [...state.modals, modal] };
        }

        case 'close': {
            return {
                ...state,
                modals: state.modals.map(modal => (modal.id === action.modalId ? { ...modal, open: false } : modal)),
            };
        }

        case 'remove':
            return {
                ...state,
                modals: state.modals.filter(notification => notification.id !== action.modalId),
            };

        default:
            return state;
    }
};

const useConfirmModalState = () => useReducer(reducer, window.confirmModals!.latestState!);

export default useConfirmModalState;
