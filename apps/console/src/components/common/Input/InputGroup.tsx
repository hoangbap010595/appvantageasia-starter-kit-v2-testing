import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export type InputGroupProps = ComponentPropsWithoutRef<'div'> & {
    disabled?: boolean;
    inputState: 'normal' | 'valid' | 'invalid';
};

const InputGroup = ({ disabled, inputState, children, className, ...props }: InputGroupProps) => (
    <div
        {...props}
        data-disabled={disabled}
        data-state={inputState}
        className={clsx(
            className,
            // layout
            'relative flex w-full items-center',
            // base box
            'rounded-md bg-white px-3 outline-1 outline-gray-300',
            // focus
            'focus-within:outline-2 focus-within:outline-pink-300',
            // invalid state
            'data-[state=invalid]:text-red-500 data-[state=invalid]:outline-red-300',
            // validate state
            'data-[state=valid]:text-green-500 data-[state=valid]:outline-green-300',
            // disable state
            'data-disabled:bg-gray-50 data-disabled:text-gray-500'
        )}
    >
        {children}
    </div>
);

export default InputGroup;
