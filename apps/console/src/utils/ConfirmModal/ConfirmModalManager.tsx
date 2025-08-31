/// <reference path="../../types/notifications.d.ts" />
import * as Sentry from '@sentry/react';
import ConfirmModal from './ConfirmModal';
import useConfirmModalState from './useConfirmModalState';

const ConfirmModalManager = () => {
    if (!window.confirmModals) {
        throw new Error('Confirm modals global variable is not initialized');
    }

    const [state, dispatch] = useConfirmModalState();

    // update the singletone variables
    window.confirmModals.dispatch = dispatch;
    window.confirmModals.latestState = state;

    return state.modals.map(modal => (
        <ConfirmModal
            key={modal.id}
            content={modal.content}
            onAfterLeave={modal.callbacks.remove}
            onConfirm={modal.callbacks.onAccept}
            onReject={modal.callbacks.onReject}
            open={modal.open}
            title={modal.title}
        />
    ));
};

export default Sentry.withProfiler(ConfirmModalManager, { name: 'ConfirmModalManager' });
