import type { ReactNode } from 'react';

export interface FormLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
}

const FormLayout = ({ children, actions }: FormLayoutProps) => (
    <>
        <div className="space-y-12">{children}</div>
        {actions && <div className="mt-6 flex items-center justify-end gap-x-6">{actions}</div>}
    </>
);

export default FormLayout;
