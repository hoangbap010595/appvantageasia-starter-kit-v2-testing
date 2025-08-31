import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { UploadProps } from '../../common/Upload';
import Upload from '../../common/Upload';

export interface UploadFieldProps extends Omit<UploadProps, 'onChange' | 'value' | 'onDelete'> {
    name: string;
}

const UploadField = ({ name, ...props }: UploadFieldProps) => {
    const { register, setValue, trigger, getValues } = useFormContext();
    const registerProps = register(name);

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files?.length) {
                const file = event?.target.files[0];
                setValue(name, {
                    file,
                    preview: URL.createObjectURL(file),
                });
                trigger(name);
            }
        },
        [name, setValue, trigger]
    );

    const onDelete = useCallback(() => {
        setValue(name, undefined);
        trigger(name);
    }, [name, setValue, trigger]);

    return <Upload {...props} {...registerProps} onChange={onChange} onDelete={onDelete} value={getValues(name)} />;
};

export default UploadField;
