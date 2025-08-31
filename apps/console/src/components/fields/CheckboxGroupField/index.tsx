import { useFormContext } from 'react-hook-form';
import type { CheckboxProps } from '../../common/Checkbox';
import Checkbox from '../../common/Checkbox';
import type { CheckboxGroupValue } from '../../common/CheckboxGroup';

interface CheckboxFieldProps extends Omit<CheckboxProps, 'name' | 'onChange' | 'ref' | 'onBlur'> {
    name: string;
    options: { value: CheckboxGroupValue; label: string; disabled?: boolean }[];
}

const CheckboxGroupField = ({ name, options, ...props }: CheckboxFieldProps) => {
    const { register } = useFormContext();
    const registerProps = register(name);

    return (
        <div className="space-y-5">
            {options.map(i => (
                <Checkbox
                    key={i.value}
                    disabled={i.disabled}
                    label={i.label}
                    value={i.value}
                    {...props}
                    {...registerProps}
                />
            ))}
        </div>
    );
};

export default CheckboxGroupField;
