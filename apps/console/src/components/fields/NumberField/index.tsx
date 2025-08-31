import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { NumberProps } from '../../common/Number';
import Number from '../../common/Number';
import { getInputState } from '../InputField';

export interface InputFieldProps
    extends Omit<NumberProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'errorElement' | 'inputState'> {
    name: string;
}

const NumberField = ({ name, ...props }: InputFieldProps) => {
    const { register, getFieldState, formState, getValues, setValue, trigger } = useFormContext();
    const registerProps = register(name);
    const fieldState = getFieldState(name, formState);

    const onChange = useCallback(
        (newValue: any) => {
            setValue(name, newValue);
            trigger(name);
        },
        [name, setValue, trigger]
    );

    return (
        <Number
            {...props}
            {...registerProps}
            errorElement={fieldState.error?.message as any}
            inputState={getInputState(fieldState, formState)}
            onChange={onChange}
            value={getValues(name)}
        />
    );
};

export default NumberField;
