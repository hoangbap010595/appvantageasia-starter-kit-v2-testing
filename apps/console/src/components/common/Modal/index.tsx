import type { TransitionRootProps, DialogProps } from '@headlessui/react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CloseButton from './CloseButton';
import Button from '@/components/common/Button';
import { useZIndex } from '@/utils/zIndexManager';

export interface ModalProps {
    // should the modal be shown or not
    open: boolean;
    // function to be called when the modal should be closed
    onClose: () => void;
    // title of the modal
    title?: string;
    // content of the modal
    children: ReactNode;
    // text for the ok button
    okText?: string;
    // should the ok button be disabled
    okDisabled?: boolean;
    // text for the cancel button
    cancelText?: string;
    // function to be called when the ok button is clicked
    onOk?: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void;
    // function to be called when the cancel button is clicked
    onCancel?: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void;
    // additional class name for the modal
    className?: string;
    // should the modal have no action
    noAction?: boolean;
    // data-cy attribute for testing
    dataCy?: string;
    // footer of the modal
    footer?: ReactNode;
    // transition props
    onAfterLeave?: TransitionRootProps['afterLeave'];
}

const Modal = ({
    open,
    onClose,
    title,
    children,
    okText,
    okDisabled,
    cancelText,
    onOk,
    onCancel,
    className,
    noAction = false,
    dataCy,
    footer,
    onAfterLeave,
}: ModalProps) => {
    const { t } = useTranslation('common');

    const zIndex = useZIndex(open);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (open && event.key === 'Enter' && !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
                onOk?.(event);
                event.preventDefault();
            }
        };

        document.addEventListener('keypress', handleKeyPress);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [open, onOk]);

    const onTransitionEnd = useCallback<NonNullable<DialogProps['onTransitionEnd']>>(() => {
        if (!open && onAfterLeave) {
            onAfterLeave();
        }
    }, [onAfterLeave, open]);

    return (
        <Dialog
            className="relative"
            data-cy={dataCy}
            onClose={onClose}
            onTransitionEnd={onTransitionEnd}
            open={open}
            style={{ zIndex }}
        >
            <DialogBackdrop
                className={clsx(
                    'fixed inset-0 bg-gray-500/75',
                    // backdrop transition
                    'transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in'
                )}
                transition
            />

            {/* Modal container to place it */}
            <div className="fixed inset-0 w-screen overflow-y-auto" style={{ zIndex }}>
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    {/* Modal */}
                    <DialogPanel
                        className={clsx(
                            // modal panel style
                            'relative w-full transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl sm:my-8 sm:w-auto sm:p-6',
                            // modal panel transition
                            'transition-all data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in',
                            className
                        )}
                        transition
                    >
                        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                            <CloseButton onClick={onClose} />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                            <DialogTitle as="h3" className={`h-6 text-base leading-6 font-semibold text-black`}>
                                {title}
                            </DialogTitle>
                            <div className="mt-2">{children}</div>
                        </div>
                        {footer}
                        {!noAction && !footer && (
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <Button className="ml-3" color="primary" disabled={okDisabled} onClick={onOk}>
                                    {okText || t('common:modal.ok')}
                                </Button>
                                <Button className="ml-3" onClick={onCancel || onClose}>
                                    {cancelText || t('common:modal.cancel')}
                                </Button>
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default Modal;
