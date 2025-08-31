import type { ButtonProps } from '@react-email/components';
import { Button } from '@react-email/components';
import { clsx } from 'clsx';

type EDMButtonProps = ButtonProps & {
    design?: 'primary' | 'secondary';
};

const EDMButton = ({ className, design = 'secondary', ...props }: EDMButtonProps) => (
    <Button
        className={clsx(
            'rounded font-medium gap-x-1.5 px-5 py-3 text-sm leading-6',
            design === 'primary' &&
                `bg-black text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`,
            design === 'secondary' && `bg-white text-gray-900 border-2 border-solid border-black  `,
            className
        )}
        {...props}
    />
);

export default EDMButton;
