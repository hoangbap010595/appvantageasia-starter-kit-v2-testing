import { clsx } from 'clsx';
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { onTelKeyPress } from '@/utils/form';

interface OTPInputFieldProps
    extends Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        | 'name'
        | 'ref'
        | 'onChange'
        | 'onBlur'
        | 'autoComplete'
        | 'onFocus'
        | 'onKeyPress'
        | 'onPaste'
        | 'pattern'
        | 'type'
    > {
    index: number;
    total?: number;
}

const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
};

const otpRegex = /^[0-9]+$/;

const OTPInputField = ({ index, total = 6, className, ...props }: OTPInputFieldProps) => {
    const { register, setValue } = useFormContext();
    const name = `code[${index}]`;
    const registerProps = register(name, {
        setValueAs: value => (value?.length >= 1 ? value[0] : ''),
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            if (newValue.length > 1) {
                // only keep the first character
                setValue(name, newValue[0]);
            }

            if (newValue.length >= 0) {
                // move on to next input or move back to previous input
                const nextIndex = event.target.value && index <= total - 1 ? index + 1 : index - 1;
                document.querySelector<HTMLElement>(`input[name="code[${nextIndex}]"]`)?.focus();
            }
        },
    });

    const onPaste = useCallback(
        (event: React.ClipboardEvent<HTMLInputElement>) => {
            const values = event.clipboardData.getData('text/plain');

            if (otpRegex.test(values)) {
                const optValues: string[] = values.split('');
                const offset = Math.min(total - index, values.length);

                for (let i = 0; i < offset; i++) {
                    // replace values individually for each input
                    setValue(`code[${index + i}]`, optValues[i]);
                }

                setTimeout(() => {
                    document.querySelector<HTMLElement>(`input[name="code[${index + offset - 1}]"]`)?.focus();
                }, 0);
            }
        },
        [index, setValue, total]
    );

    return (
        <input
            {...props}
            {...registerProps}
            autoComplete="off"
            className={clsx(
                'focus: h-10 w-10 rounded-md border-gray-400 text-center caret-black focus:border-gray-400 focus:ring-0 focus:outline-none',
                className
            )}
            name={`code[${index}]`}
            onFocus={onFocus}
            onKeyPress={onTelKeyPress}
            onPaste={onPaste}
            pattern="\d*"
            type="text"
        />
    );
};

export default OTPInputField;
