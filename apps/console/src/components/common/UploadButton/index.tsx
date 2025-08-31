import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as notifications from '../../../utils/notifications';
import Button from '@/components/common/Button';

interface UploadButtonProps {
    label: string;
    accept: string;
    className?: string;
    onUpload?: (file: File) => Promise<void>;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /**
     * true => it is in modal and modal open
     * false => it is in modal and modal is close
     * undefined => it is not in modal
     */
    modalOpen?: boolean;
}

const UploadButton = ({ className, label, accept, onUpload, size = 'm', modalOpen }: UploadButtonProps) => {
    const { t } = useTranslation('common');
    const [isLoading, setIsLoading] = useState(false);

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event?.target.files[0];
            try {
                setIsLoading(true);
                await onUpload?.(file);
                event.target.value = '';
            } catch {
                notifications.error({ message: t('common:uploadFailed') });
            } finally {
                setIsLoading(false);
            }
        } else {
            notifications.error({ message: t('common:selectError') });
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (
                modalOpen &&
                event.key === 'Enter' &&
                !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
            ) {
                inputRef.current?.click();

                event.preventDefault();
            }
        };

        document.addEventListener('keypress', handleKeyPress);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [modalOpen]);

    return (
        <Button className={clsx('p-0', className)} color="primary" disabled={isLoading}>
            <label
                className={clsx(
                    'block cursor-pointer',
                    size === 'xs' && 'gap-x-1.5 px-2 py-1 text-xs leading-5',
                    size === 's' && 'gap-x-1.5 px-2 py-1 text-sm leading-6',
                    size === 'm' && 'gap-x-1.5 px-2.5 py-1.5 text-sm leading-6',
                    size === 'l' && 'gap-x-1.5 px-3 py-2 text-sm leading-6',
                    size === 'xl' && 'gap-x-2 px-3.5 py-2.5 text-sm leading-6'
                )}
                htmlFor="file"
            >
                {isLoading ? t('common:uploading') : label}
            </label>
            <input
                ref={inputRef}
                accept={accept}
                className="hidden"
                disabled={isLoading}
                id="file"
                multiple={false}
                onChange={onChange}
                type="file"
            />
        </Button>
    );
};

export default UploadButton;
