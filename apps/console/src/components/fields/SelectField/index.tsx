import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import Select, { type SelectProps } from '@/components/common/Select';
import { getInputState } from '@/components/fields/InputField';

export interface SelectFieldProps extends Omit<SelectProps, 'onChange' | 'errorElement' | 'inputState' | 'value'> {
    name: string;
}

const SelectField = ({ name, ...props }: SelectFieldProps) => {
    const { register, setValue, trigger, getValues, formState, getFieldState } = useFormContext();
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
        <Select
            {...props}
            {...registerProps}
            errorElement={fieldState.error?.message as any}
            inputState={getInputState(fieldState, formState)}
            onChange={onChange}
            value={getValues(name)}
        />
    );
};

export default SelectField;
