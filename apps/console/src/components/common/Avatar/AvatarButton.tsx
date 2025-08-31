import * as Headless from '@headlessui/react';
import { clsx } from 'clsx';
import type React from 'react';
import { forwardRef } from 'react';
import Avatar, { type AvatarProps } from './index';
import TouchTarget from '@/components/common/Button/TouchTarget';
import Link from '@/components/common/Link';

const AvatarButton = forwardRef(function AvatarButton(
    {
        src,
        square = false,
        initials,
        alt,
        className,
        ...props
    }: AvatarProps &
        (
            | Omit<Headless.ButtonProps, 'as' | 'className'>
            | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
        ),
    ref: React.ForwardedRef<HTMLElement>
) {
    const classes = clsx(
        className,
        square ? 'rounded-[20%]' : 'rounded-full',
        'relative inline-grid focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500'
    );

    return 'to' in props ? (
        <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
            <TouchTarget>
                <Avatar src={src} square={square} initials={initials} alt={alt} />
            </TouchTarget>
        </Link>
    ) : (
        <Headless.Button {...props} className={classes} ref={ref}>
            <TouchTarget>
                <Avatar src={src} square={square} initials={initials} alt={alt} />
            </TouchTarget>
        </Headless.Button>
    );
});

export default AvatarButton;
