import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type PrimaryButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    size?: 'small' | 'normal';
};

const PrimaryButton = ({ className, size = 'normal', ...props }: PrimaryButtonProps) => (
    <button
        className={clsx(
            'hover:bg-opacity-90 mt-1 inline-flex items-center gap-2 rounded-md bg-blue-700 font-medium text-white',
            size === 'small' && 'px-1 py-1',
            size === 'normal' && 'px-6 py-3',
            props.disabled && 'hover:bg-opacity-100 cursor-not-allowed opacity-50',
            className
        )}
        type="button"
        {...props}
    />
);

export default PrimaryButton;
