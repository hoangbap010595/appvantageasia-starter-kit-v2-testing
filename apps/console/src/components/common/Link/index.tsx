import { DataInteractive } from '@headlessui/react';
import type { ForwardedRef, ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';

export type LinkProps = ComponentPropsWithoutRef<typeof RouterLink>;

const Link = (props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) => (
    <DataInteractive>
        <RouterLink {...props} ref={ref} />
    </DataInteractive>
);

export default forwardRef(Link);
