import { forwardRef, type ChangeEvent } from 'react';
import type { CheckboxProps } from '../Checkbox';
import Checkbox from '../Checkbox';

export type CheckboxGroupValue = number | string;

export type CheckboxGroupProps = Omit<CheckboxProps, 'value' | 'onChange'> & {
    options: { value: CheckboxGroupValue; label: string; disabled?: boolean }[];
    onChange: (v: CheckboxGroupValue[]) => void;
    value?: CheckboxGroupValue[];
};

const CheckboxGroup = forwardRef(function CheckboxGroup({ options, value, onChange, ...props }: CheckboxGroupProps) {
    const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isSelected = value ? value.includes(event.target.value) : false;
        let newValues = value ? [...value] : [];

        // switch active status
        if (isSelected) {
            newValues = newValues.filter(i => i !== event.target.value);
        } else {
            newValues.push(event.target.value);
        }

        onChange(newValues);
    };

    return (
        <div className="space-y-2">
            {options.map(i => (
                <Checkbox
                    key={i.value}
                    checked={value?.includes(i.value)}
                    disabled={i.disabled}
                    label={i.label}
                    onChange={onCheckboxChange}
                    value={i.value}
                    {...props}
                />
            ))}
        </div>
    );
});

export default CheckboxGroup;
