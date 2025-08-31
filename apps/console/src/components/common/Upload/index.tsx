import { PhotoIcon } from '@heroicons/react/24/solid';
import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode, ForwardedRef } from 'react';
import { useCallback, useId, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from './DeleteButton';

export type UploadProps = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'value'> & {
    label?: ReactNode;
    value?: {
        file?: File;
        preview: string;
    };
    onDelete: () => void;
};

export const allowJpgAndPngOnly = ['.jpg', '.jpeg', '.png'];
export const allowedImageExtensions = [...allowJpgAndPngOnly, '.gif', '.svg'];

const UploadWithRef = (
    { id: idFromProps, className, label, value, onDelete, ...props }: UploadProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: ForwardedRef<unknown>
) => {
    const { t } = useTranslation('common');
    const fallbackId = useId();
    const id = idFromProps || fallbackId;
    const handleDelete = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onDelete();
        },
        [onDelete]
    );

    return (
        <div className="col-span-full">
            <label className="block text-sm leading-6 font-medium text-gray-900 capitalize" htmlFor="cover-photo">
                {label}
            </label>

            <label htmlFor={id}>
                {!value?.preview && (
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-4 py-4">
                        <div className="text-center">
                            <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                            <div className="mt-2 text-sm leading-6 text-gray-600">
                                <span>{t('common:uploadFile')}</span>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">{t('common:acceptImage')}</p>
                        </div>
                    </div>
                )}
                <input
                    accept={allowedImageExtensions.join(',')}
                    className="sr-only"
                    id={id}
                    multiple={false}
                    name="file-upload"
                    type="file"
                    {...props}
                />
            </label>
            {value?.preview && (
                <div className="relative mt-2 flex justify-center rounded-md border border-dashed border-gray-900/25 py-4">
                    <img alt="logo" className="mx-auto h-20 w-auto object-contain" src={value?.preview} />
                    <DeleteButton className="absolute -top-3 -right-3" onClick={handleDelete} />
                </div>
            )}
        </div>
    );
};

const Upload = forwardRef(UploadWithRef);

export default Upload;
