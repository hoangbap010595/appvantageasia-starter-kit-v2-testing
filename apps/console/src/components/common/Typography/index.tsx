import { clsx } from 'clsx';
import { createElement, type ComponentPropsWithRef, forwardRef, type ForwardedRef } from 'react';

const elements = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-bold',
    h4: 'text-xl font-bold',
    h5: 'text-lg font-bold',
    h6: 'text-lg font-bold',
    div: 'text-base',
    p: 'text-base',
    span: 'text-base',
};

const colors = {
    primary: 'text-pink-500',
    secondary: 'text-black dark:text-white',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    help: 'text-gray-500',
};

export type TypographyElement = keyof typeof elements;

export type TypographyColor = keyof typeof colors;

const defaultColors = {
    h1: 'secondary',
    h2: 'secondary',
    h3: 'secondary',
    h4: 'secondary',
    h5: 'secondary',
    h6: 'secondary',
    div: 'secondary',
    p: 'secondary',
    span: 'secondary',
} satisfies Record<TypographyElement, TypographyColor>;

export type TypographyProps<T extends TypographyElement = 'p'> = {
    as?: T;
    color?: TypographyColor;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'color'>;

const Typography = forwardRef(function Typography<T extends TypographyElement = 'p'>(
    { as, color, className, children, ...props }: TypographyProps<T>,
    ref: ForwardedRef<HTMLElement>
) {
    const Component = as || 'div';
    return createElement(
        Component,
        {
            ...props,
            ref,
            className: clsx(className, elements[Component], colors[color || defaultColors[Component]]),
        },
        children
    );
});

export default Typography;
