import { Listbox, ListboxButton, ListboxOption, ListboxOptions, type ListboxProps } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { useId, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Field, { type FieldProps } from '@/components/common/Field';
import InputGroup from '@/components/common/Input/InputGroup';

export const defaultRenderOption = (option: SelectOption) => (
    <>
        <span className="block truncate">{option.label}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-pink-600 group-data-[focus]:text-white group-[&:not([data-selected])]:hidden">
            <CheckIcon aria-hidden="true" className="size-5" />
        </span>
    </>
);

export interface SelectOption {
    value: string | number | null;
    label: string;
    [key: string]: any;
}

interface BaseProps extends Omit<FieldProps, 'id' | 'children'> {
    id?: string;
    options: SelectOption[];
    inputState?: 'valid' | 'invalid' | 'normal';
    renderOption?: (option: SelectOption) => ReactNode;
    name: string;
    placeholder?: string;
    disabled?: boolean;
}

type ModeProps =
    | { multiple?: false; value?: SelectOption['value']; onChange?: (value: SelectOption['value']) => void }
    | { multiple: true; value?: SelectOption['value'][]; onChange?: (value: SelectOption['value'][]) => void };

export type SelectProps = BaseProps & ModeProps;

const useListBox = (props: ModeProps): ListboxProps<any, SelectOption['value'] | SelectOption['value'][]> => {
    if (props.multiple) {
        return {
            multiple: true,
            value: props.value,
            onChange: (value: SelectOption['value'][]) => props.onChange && props.onChange(value),
        };
    }

    return {
        value: props.value,
        onChange: (value: SelectOption['value']) => props.onChange && props.onChange(value),
    };
};

const Select = ({
    id,
    label,
    options,
    renderOption = defaultRenderOption,
    helpElement,
    inputState = 'normal',
    errorElement,
    name,
    placeholder,
    disabled = false,
    ...props
}: SelectProps) => {
    const elementId = useId();
    const computedId = id || elementId;
    const { t } = useTranslation('common');

    const listBoxProps = useListBox(props);

    const { value } = props;
    const selectedOptions = useMemo(() => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return options.filter(option => value.includes(option.value));
        }

        return [options.find(option => option.value === value)!];
    }, [options, value]);

    const optionLabel =
        (selectedOptions.length === 1 && selectedOptions[0].label) ||
        (selectedOptions.length > 1 && selectedOptions.map(option => option.label).join(', ')) ||
        placeholder ||
        (props.multiple ? t('common:select.placeholderMultiple') : t('common:select.placeholderSingle'));

    return (
        <Listbox {...listBoxProps}>
            <Field name={name} label={label} errorElement={errorElement} helpElement={helpElement} id={computedId}>
                <ListboxButton
                    as={InputGroup}
                    disabled={disabled}
                    inputState={inputState}
                    data-cy="select"
                    data-cy-id={computedId}
                    data-empty={!selectedOptions.length || undefined}
                    className="cursor-pointer data-disabled:cursor-not-allowed data-empty:text-gray-400"
                >
                    <span className="w-full grow truncate py-1.5 pr-1 sm:text-sm">{optionLabel}</span>
                    <span className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">
                        <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    anchor="bottom start"
                    className={clsx(
                        // position
                        'absolute z-10 mt-1 max-h-56 overflow-auto',
                        // base
                        'rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm',
                        // transitions
                        'data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[leave]:opacity-0'
                    )}
                    data-cy="options"
                    data-cy-id={computedId}
                    transition
                >
                    {options.map(option => (
                        <ListboxOption
                            key={option.value}
                            value={option.value}
                            className={clsx(
                                // base
                                'group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none',
                                // focus
                                'data-[focus]:bg-pink-600 data-[focus]:text-white data-[focus]:outline-none'
                            )}
                        >
                            {renderOption(option)}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Field>
        </Listbox>
    );
};

export default Select;
