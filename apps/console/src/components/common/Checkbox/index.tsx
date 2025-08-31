import { clsx } from 'clsx';
import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';
import { useId, forwardRef } from 'react';

export type CheckboxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: ReactNode;
};

const Checkbox = forwardRef(function Checkbox(
    { id: idFromProps, className, label, ...props }: CheckboxProps,
    ref: CheckboxProps['ref']
) {
    const fallbackId = useId();
    const id = idFromProps || fallbackId;

    return (
        <div className="relative flex items-start">
            <div className="flex h-6 items-center">
                <input
                    ref={ref}
                    className={clsx(
                        'size-4 rounded border-gray-300 text-pink-400 focus:ring-pink-300',
                        'disabled:opacity-50'
                    )}
                    id={id}
                    type="checkbox"
                    {...props}
                />
            </div>
            <div className="ml-3 text-sm leading-6">
                <label
                    className={clsx(
                        'cursor-pointer font-medium text-gray-600 capitalize',
                        'data-disabled:cursor-default data-disabled:text-gray-500'
                    )}
                    htmlFor={id}
                    data-disabled={props.disabled}
                >
                    {label}
                </label>
            </div>
        </div>
    );
});

export default Checkbox;
