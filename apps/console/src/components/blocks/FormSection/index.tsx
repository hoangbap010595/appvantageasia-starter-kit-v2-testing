import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface ColItemProps {
    children: ReactNode;
    className?: string;
}

export const ColItem = ({ children, className }: ColItemProps) => (
    <div className={clsx('sm:col-span-2', className)}>{children}</div>
);

export interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    extra?: ReactNode;
    className?: string;
}

const FormSection = ({ title, description, children, extra, className }: FormSectionProps) => (
    <div
        className={clsx(
            className,
            'grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'
        )}
    >
        <div>
            <h2 className="text-base leading-7 font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>}
        </div>

        <div className="sm:grid-cols-6 md:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">{children}</div>
            <div className="mt-10">{extra}</div>
        </div>
    </div>
);

export default FormSection;
