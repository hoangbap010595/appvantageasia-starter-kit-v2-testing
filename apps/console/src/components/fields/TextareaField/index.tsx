import { useFormContext } from 'react-hook-form';
import type { TextareaProps } from '../../common/Textarea';
import Textarea from '../../common/Textarea';
import { getInputState } from '../InputField';

export interface TextareaFieldProps
    extends Omit<TextareaProps, 'name' | 'onChange' | 'ref' | 'onBlur' | 'errorElement' | 'inputState'> {
    name: string;
}

const TextareaField = ({ name, ...props }: TextareaFieldProps) => {
    const { register, getFieldState, formState } = useFormContext();
    const registerProps = register(name);
    const fieldState = getFieldState(name, formState);

    return (
        <Textarea
            {...props}
            {...registerProps}
            errorElement={fieldState.error?.message as any}
            inputState={getInputState(fieldState, formState)}
        />
    );
};

export default TextareaField;
