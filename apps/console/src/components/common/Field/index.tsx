import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import Space from '@/components/common/Space';

export interface FieldProps {
    name: string;
    id: string;
    label?: ReactNode;
    helpElement?: ReactNode;
    errorElement?: ReactNode;
    labelExtra?: ReactNode;
    children: ReactNode;
    className?: string;
}

const Field = ({ name, id, label, labelExtra, helpElement, errorElement, children, className }: FieldProps) => {
    let labelElement: ReactNode = null;

    if (label) {
        labelElement = (
            <label
                className="block text-left text-sm leading-6 font-medium text-black capitalize dark:text-white"
                htmlFor={id}
            >
                {label}
            </label>
        );

        if (labelExtra) {
            labelElement = (
                <div className="flex items-center justify-between">
                    {labelElement}
                    {labelExtra}
                </div>
            );
        }
    }

    return (
        <Space className={clsx(className, 'w-full')} direction="vertical" gapSize={2} data-input-name={name}>
            {labelElement}
            {children}
            {errorElement && <p className="text-sm text-red-500">{errorElement}</p>}
            {helpElement && <p className="text-sm text-gray-500 dark:text-white">{helpElement}</p>}
        </Space>
    );
};

export default Field;
