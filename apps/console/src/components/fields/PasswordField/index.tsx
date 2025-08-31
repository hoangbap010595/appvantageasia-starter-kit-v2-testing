import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import type { InputFieldProps } from '../InputField';
import InputField from '../InputField';

export type PasswordFieldProps = InputFieldProps & {
    showEye?: boolean;
    showLock?: boolean;
};

const PasswordField = ({ showEye = true, showLock = false, ...props }: PasswordFieldProps) => {
    const [isEyeOpen, setEyeOpen] = useState(false);
    const eye = isEyeOpen ? (
        <EyeIcon className="text-black-400 h-5 w-5" />
    ) : (
        <EyeSlashIcon className="text-black-400 h-5 w-5" />
    );

    const suffixElement = showEye ? eye : null;
    const prefixElement = showLock ? <LockClosedIcon className="text-black-400 h-5 w-5" /> : null;

    return (
        <InputField
            {...props}
            onSuffixClick={() => setEyeOpen(state => !state)}
            prefixElement={prefixElement}
            suffixElement={suffixElement}
            type={isEyeOpen ? 'text' : 'password'}
        />
    );
};

export default PasswordField;
