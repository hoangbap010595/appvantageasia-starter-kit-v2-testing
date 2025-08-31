import { Button as HeadlessButton, type ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { clsx } from 'clsx';
import { type ComponentPropsWithoutRef, type ReactNode, type ForwardedRef } from 'react';
import { forwardRef } from 'react';
import TouchTarget from './TouchTarget';
import Link from '@/components/common/Link';

const base = [
    // Base
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    // Sizing
    'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
    // Focus
    'focus:outline-hidden data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    // Disabled
    'data-disabled:opacity-50',
    // cursors
    'cursor-pointer disabled: cursor-not-allowed',
    // Icon
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
];

const styles = {
    base: [
        // Base
        'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
        // Sizing
        'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
        // Focus
        'focus:outline-hidden data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
        // Disabled
        'data-disabled:opacity-50',
        // Icon
        '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
    ],
    solid: [
        // Optical border, implemented as the button background to avoid corner artifacts
        'border-transparent bg-(--btn-border)',
        // Dark mode: border is rendered on `after` so background is set to button background
        'dark:bg-(--btn-bg)',
        // Button background, implemented as foreground layer to stack on top of pseudo-border layer
        'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)',
        // Drop shadow, applied to the inset `before` layer so it blends with the border
        'before:shadow-sm',
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        'dark:before:hidden',
        // Dark mode: Subtle white outline is applied using a border
        'dark:border-white/5',
        // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
        'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
        // Inner highlight shadow
        'after:shadow-[shadow:inset_0_1px_--theme(--color-white/15%)]',
        // White overlay on hover
        'data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)',
        // Dark mode: `after` layer expands to cover entire button
        'dark:after:-inset-px dark:after:rounded-lg',
        // Disabled
        'data-disabled:before:shadow-none data-disabled:after:shadow-none',
    ],
    outline: [
        // Base
        'border-zinc-950/10 text-zinc-950 data-active:bg-zinc-950/[2.5%] data-hover:bg-zinc-950/[2.5%]',
        // Dark mode
        'dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
        // Icon
        '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
    ],
    plain: [
        // Base
        'border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5',
        // Dark mode
        'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
        // Icon
        '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
    ],
};

const colors = {
    default: [
        'text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10',
        'dark:text-white dark:[--btn-bg:var(--color-zinc-600)] dark:[--btn-hover-overlay:var(--color-white)]/5',
        '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]',
    ],
    primary: [
        'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-pink-500)] [--btn-border:var(--color-pink-600)]/90',
        '[--btn-icon:var(--color-pink-300)] data-active:[--btn-icon:var(--color-pink-200)] data-hover:[--btn-icon:var(--color-pink-200)]',
    ],
};

export type ButtonProps = (
    | { color?: keyof typeof colors; outline?: never; plain?: never }
    | { color?: never; outline: true; plain?: never }
    | { color?: never; outline?: never; plain: true }
    | { color?: never; outline?: never; plain: never }
) & { className?: string; children: ReactNode } & (
        | Omit<HeadlessButtonProps, 'as' | 'className'>
        | Omit<ComponentPropsWithoutRef<typeof Link>, 'className'>
    );

const Button = forwardRef(function Button(
    { color, outline, plain, className, children, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLElement>
) {
    const classes = clsx(
        className,
        base,
        outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, colors[color ?? 'default'])
    );

    return 'to' in props ? (
        <Link {...props} className={classes} ref={ref as ForwardedRef<HTMLAnchorElement>}>
            <TouchTarget>{children}</TouchTarget>
        </Link>
    ) : (
        <HeadlessButton type="button" {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
            <TouchTarget>{children}</TouchTarget>
        </HeadlessButton>
    );
});

export default Button;
