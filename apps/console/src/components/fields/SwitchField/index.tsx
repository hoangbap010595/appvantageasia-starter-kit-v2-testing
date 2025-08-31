import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { SwitchProps } from '../../common/Switch';
import Switch from '../../common/Switch';

export interface SwitchFieldProps extends Omit<SwitchProps, 'onChange' | 'value'> {
    name: string;
}

const SwitchField = ({ name, ...props }: SwitchFieldProps) => {
    const { register, setValue, trigger, getValues } = useFormContext();
    const registerProps = register(name);

    const onChange = useCallback(
        (newValue: any) => {
            setValue(name, newValue);
            trigger(name);
        },
        [name, setValue, trigger]
    );

    return <Switch {...props} {...registerProps} name={name} onChange={onChange} value={getValues(name)} />;
};

export default SwitchField;
