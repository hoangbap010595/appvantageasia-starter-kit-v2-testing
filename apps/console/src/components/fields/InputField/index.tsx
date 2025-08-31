import type { FormState, UseFormGetFieldState } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type { InputProps } from '../../common/Input';
import Input from '../../common/Input';

export interface InputFieldProps
    extends Omit<InputProps, 'name' | 'onChange' | 'ref' | 'onBlur' | 'errorElement' | 'inputState'> {
    name: string;
}

export const getInputState = (
    fieldState: ReturnType<UseFormGetFieldState<any>>,
    formState: FormState<any>
): InputProps['inputState'] => {
    if (fieldState.isDirty && fieldState.invalid) {
        return 'invalid';
    }

    if (fieldState.isDirty && formState.isSubmitted) {
        return 'valid';
    }

    return 'normal';
};

const InputField = ({ name, ...props }: InputFieldProps) => {
    const { register, getFieldState, formState } = useFormContext();
    const registerProps = register(name);
    const fieldState = getFieldState(name, formState);

    return (
        <Input
            {...props}
            {...registerProps}
            errorElement={fieldState.error?.message as any}
            inputState={getInputState(fieldState, formState)}
        />
    );
};

export default InputField;
