import { useFormContext, Controller } from 'react-hook-form';
import DatePicker, { type DatePickerProps } from '@/components/common/DatePicker';
import { getInputState } from '@/components/fields/InputField';

interface DatePickerFieldProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
    name: string;
}

const DatePickerField = ({ name, ...props }: DatePickerFieldProps) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, formState, fieldState }) => (
                <DatePicker
                    {...props}
                    value={field.value}
                    name={name}
                    errorElement={fieldState.error?.message as any}
                    inputState={getInputState(fieldState, formState)}
                    onChange={value => {
                        field.onChange(value);
                    }}
                />
            )}
        />
    );
};

export default DatePickerField;
