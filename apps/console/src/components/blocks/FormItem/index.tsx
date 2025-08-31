import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useId } from 'react';

export interface FormItemProps {
    dataInputName?: string;
    label?: ReactNode;
    children: ReactNode;
}
const FormItem = ({ label, children, dataInputName }: FormItemProps) => {
    const fallbackId = useId();

    return (
        <div data-input-name={dataInputName}>
            <label
                className={`block text-left text-sm leading-6 font-medium text-black capitalize`}
                htmlFor={fallbackId}
            >
                {label}
            </label>
            <div className={clsx('relative', label && 'mt-2')} id={fallbackId}>
                {children}
            </div>
        </div>
    );
};

export default FormItem;
