import { Switch as HeadSwitch } from '@headlessui/react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { FormItemProps } from '../../blocks/FormItem';
import FormItem from '../../blocks/FormItem';

export type SwitchProps = Pick<FormItemProps, 'label'> & {
    name?: string;
    value: boolean;
    onChange?: (value: boolean) => void;
    helpElement?: ReactNode;
};

const Switch = ({ label, value, onChange, helpElement, name }: SwitchProps) => (
    <FormItem dataInputName={name} label={label}>
        <HeadSwitch
            checked={value}
            className={clsx(
                `group relative inline-flex h-6 w-11 focus:ring-pink-400 data-[checked]:bg-pink-400`,
                `flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors`,
                `duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none`
            )}
            data-cy="switchField"
            onChange={onChange}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={clsx(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow',
                    'ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
                )}
            />
        </HeadSwitch>
        {helpElement && <p className="mt-2 text-sm text-gray-500">{helpElement}</p>}
    </FormItem>
);
export default Switch;
