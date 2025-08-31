import { Popover } from '@headlessui/react';
import { CalendarIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { useId } from 'react';
import { DayPicker, type PropsBase, type PropsSingle } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import Field, { type FieldProps } from '../Field';
import InputGroup from '@/components/common/Input/InputGroup';
import useDateFormats from '@/utils/useDateFormats';
import 'react-day-picker/dist/style.css';

export type DatePickerProps = Omit<FieldProps, 'id' | 'children'> & {
    id?: string;
    value: Date | undefined;
    onChange?: PropsSingle['onSelect'];
    inputState?: 'valid' | 'invalid' | 'normal';
    disabled?: boolean;
    pickerProps?: Omit<PropsSingle, 'classNames' | 'selected' | 'onSelect'>;
    name?: string;
};

const classNames: PropsBase['classNames'] = {
    selected: 'text-pink-400',
    today: 'text-blue-400',
    chevron: 'fill-pink-400',
};

const DatePicker = ({
    value,
    onChange,
    id,
    label,
    helpElement,
    labelExtra,
    errorElement,
    inputState = 'normal',
    disabled,
    pickerProps,
    name,
}: DatePickerProps) => {
    const elementId = useId();
    const computedId = id || elementId;
    const { t } = useTranslation(['common']);
    const { formatDate } = useDateFormats();

    let suffix = <CalendarIcon className="size-5" />;

    if (inputState === 'invalid') {
        suffix = <ExclamationCircleIcon aria-hidden="true" className="size-5 text-red-500" />;
    } else if (inputState === 'valid') {
        suffix = <CheckCircleIcon aria-hidden="true" className="size-5 text-green-500" />;
    }

    const input = (
        <Popover className="relative w-full">
            <Popover.Button
                as={InputGroup}
                disabled={disabled}
                inputState={inputState}
                data-empty={!value || undefined}
                className="cursor-pointer text-black data-disabled:cursor-not-allowed data-empty:text-gray-400"
            >
                <span className="w-full grow py-1.5 pr-1 sm:text-sm">
                    {value ? formatDate(value) : t('common:empty.pickDate')}
                </span>
                <span className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">{suffix}</span>
            </Popover.Button>
            <Popover.Panel
                transition
                anchor="bottom"
                className={clsx(
                    // Anchor positioning
                    '[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(1)] data-[anchor~=end]:[--anchor-offset:6px] data-[anchor~=start]:[--anchor-offset:-6px] sm:data-[anchor~=end]:[--anchor-offset:4px] sm:data-[anchor~=start]:[--anchor-offset:-4px]',
                    // Base styles
                    'isolate w-max rounded-xl p-2',
                    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                    'outline outline-transparent focus:outline-hidden',
                    // Handle scrolling when menu won't fit in viewport
                    'overflow-y-auto',
                    // Popover background
                    'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
                    // Shadows
                    'shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset',
                    // Transitions
                    'transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0'
                )}
            >
                <DayPicker
                    {...pickerProps}
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    classNames={classNames}
                />
            </Popover.Panel>
        </Popover>
    );

    return (
        <Field
            name={name}
            id={computedId}
            label={label}
            errorElement={errorElement}
            helpElement={helpElement}
            labelExtra={labelExtra}
        >
            {input}
        </Field>
    );
};

export default DatePicker;
