import { clsx } from 'clsx';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

const sizes = {
    2: 'gap-2',
    5: 'gap-5',
};

type SpaceProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    direction?: 'horizontal' | 'vertical';
    children: ReactNode;
    gapSize?: keyof typeof sizes;
};

const Space = ({ children, className, direction = 'horizontal', gapSize = 5, ...props }: SpaceProps) => (
    <div
        {...props}
        className={clsx(
            className,
            `flex min-w-0`,
            sizes[gapSize],
            direction === 'horizontal' && 'flex-row items-center',
            direction === 'vertical' && 'flex-col justify-center'
        )}
    >
        {children}
    </div>
);
export default Space;
