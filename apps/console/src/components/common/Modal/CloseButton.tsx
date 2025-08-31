import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type CloseButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const CloseButton = (props: CloseButtonProps) => (
    <button
        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:outline-none"
        type="button"
        {...props}
    >
        <span className="sr-only">Close</span>
        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
    </button>
);

export default CloseButton;
