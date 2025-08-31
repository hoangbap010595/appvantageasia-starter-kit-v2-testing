import { useFormContext } from 'react-hook-form';
import type { CheckboxProps } from '../../common/Checkbox';
import Checkbox from '../../common/Checkbox';

interface CheckboxFieldProps extends Omit<CheckboxProps, 'name' | 'onChange' | 'ref' | 'onBlur'> {
    name: string;
}

const CheckboxField = ({ name, ...props }: CheckboxFieldProps) => {
    const { register } = useFormContext();
    const registerProps = register(name);

    return <Checkbox {...props} {...registerProps} />;
};

export default CheckboxField;
