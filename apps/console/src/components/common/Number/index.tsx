import isNil from 'lodash/fp/isNil';
import { useCallback, useState, type ChangeEvent, type FocusEvent } from 'react';
import Input, { type InputProps } from '@/components/common/Input';

export type NumberProps = InputProps & {
    precision?: number;
};

const Number = ({ precision = 2, value, onChange, onBlur, ...props }: NumberProps) => {
    const [inputValue, setInputValue] = useState(isNil(value) ? '' : value);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (value === '') {
                setInputValue(value);
                onChange?.(value as unknown as ChangeEvent<HTMLInputElement>);

                return;
            }

            const isValidNumber = new RegExp(`^\\d*(\\.\\d{0,${precision}})?$`).test(value);
            if (isValidNumber) {
                setInputValue(value);
                onChange?.(parseFloat(value) as unknown as ChangeEvent<HTMLInputElement>);
            }
        },
        [onChange, precision]
    );

    const handelBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            if (inputValue === '') {
                setInputValue?.('');
            } else {
                setInputValue?.(parseFloat(inputValue as string).toString());
            }
            onBlur?.(e);
        },
        [inputValue, onBlur]
    );

    return <Input {...props} onBlur={handelBlur} onChange={handleChange} type="text" value={inputValue} />;
};
export default Number;
