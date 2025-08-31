import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../../components/common/Modal';
import Modal from '../../components/common/Modal';

export type ConfirmModalProps = Pick<ModalProps, 'open' | 'title' | 'onAfterLeave'> & {
    content?: string;
    onConfirm: () => void;
    onReject: () => void;
};

const ConfirmModal = ({ content, onConfirm, onReject, ...props }: ConfirmModalProps) => {
    const { t } = useTranslation('common');

    return (
        <Modal
            {...props}
            className="!max-w-96"
            dataCy="confirmation"
            okText={t('common:confirmModal.actions.confirm')}
            onCancel={onReject}
            onClose={onReject}
            onOk={onConfirm}
        >
            <div>{content}</div>
        </Modal>
    );
};

export default ConfirmModal;
