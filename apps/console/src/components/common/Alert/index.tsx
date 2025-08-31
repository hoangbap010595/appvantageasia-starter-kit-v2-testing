import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import isArray from 'lodash/fp/isArray';
import type { ReactNode } from 'react';

interface AlertProps {
    title?: string;
    description?: ReactNode;
    /** 'warning' | 'error' | 'success' | 'notice'  */
    type: 'warning' | 'error' | 'success' | 'notice';
    actions?: { text: string; onAction: () => void }[];
    hasAccentBorder?: boolean;
    onDismiss?: () => void;
    rightLink?: { description: string; text: string; url: string };
    text?: string | ReactNode;
}

const Alert = ({ type, title, description, actions, hasAccentBorder, onDismiss, rightLink, text }: AlertProps) => (
    <div
        className={clsx(
            'p-4',
            !hasAccentBorder && 'rounded-md',
            hasAccentBorder && type === 'warning' && 'border-l-4 border-yellow-400',
            hasAccentBorder && type === 'error' && 'border-l-4 border-red-500',
            hasAccentBorder && type === 'success' && 'border-l-4 border-green-400',
            hasAccentBorder && type === 'notice' && 'border-l-4 border-blue-400',
            type === 'warning' && 'bg-yellow-50',
            type === 'error' && 'bg-red-50',
            type === 'success' && 'bg-green-50',
            type === 'notice' && 'bg-blue-50'
        )}
    >
        <div className="flex">
            <div className="flex-shrink-0">
                {type === 'warning' && (
                    <ExclamationTriangleIcon aria-hidden="true" className="size-5 text-yellow-400" />
                )}
                {type === 'error' && <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />}
                {type === 'success' && <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />}
                {type === 'notice' && <InformationCircleIcon aria-hidden="true" className="size-5 text-blue-400" />}
            </div>
            {(title ||
                (isArray(description) && description.length > 0) ||
                (!isArray(description) && description) ||
                (actions && actions?.length > 0)) && (
                <div className="ml-3 w-full">
                    {title && (
                        <h3
                            className={clsx(
                                'text-sm font-medium',
                                type === 'warning' && 'text-yellow-800',
                                type === 'error' && 'text-red-800',
                                type === 'success' && 'text-green-800',
                                type === 'notice' && 'text-blue-800'
                            )}
                        >
                            {title}
                        </h3>
                    )}
                    {isArray(description) && description.length > 0 && (
                        <div
                            className={clsx(
                                'text-sm',
                                !!title && 'mt-2',
                                type === 'warning' && 'text-yellow-700',
                                type === 'error' && 'text-red-700',
                                type === 'success' && 'text-green-700',
                                type === 'notice' && 'text-blue-700'
                            )}
                        >
                            <ul className="list-disc space-y-1 pl-5">
                                {description.map(i => (
                                    <li key={i.toString()}>{i}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!isArray(description) && description && (
                        <div
                            className={clsx(
                                'text-sm',
                                !!title && 'mt-2',
                                type === 'warning' && 'text-yellow-700',
                                type === 'error' && 'text-red-700',
                                type === 'success' && 'text-green-700',
                                type === 'notice' && 'text-blue-700'
                            )}
                        >
                            <p>{description}</p>
                        </div>
                    )}
                    {actions && actions?.length > 0 && (
                        <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                                {actions.map((i, index) => (
                                    <button
                                        key={index.toString()}
                                        className={clsx(
                                            'rounded-md px-2 py-1.5 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none',
                                            index > 0 && 'ml-3',
                                            type === 'warning' &&
                                                'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
                                            type === 'error' &&
                                                'bg-red-50 text-red-800 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
                                            type === 'success' &&
                                                'bg-green-50 text-green-800 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
                                            type === 'notice' &&
                                                'bg-blue-50 text-blue-800 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
                                        )}
                                        onClick={i.onAction}
                                        type="button"
                                    >
                                        {i.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {rightLink && (
                <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p
                        className={clsx(
                            'text-sm',
                            type === 'warning' && 'text-yellow-700',
                            type === 'error' && 'text-red-700',
                            type === 'success' && 'text-green-700',
                            type === 'notice' && 'text-blue-700'
                        )}
                    >
                        {rightLink.description}
                    </p>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                        <a
                            className={clsx(
                                'font-medium whitespace-nowrap',
                                type === 'warning' && 'text-yellow-700 hover:text-yellow-600',
                                type === 'error' && 'text-red-700 hover:text-red-600',
                                type === 'success' && 'text-green-700 hover:text-green-600',
                                type === 'notice' && 'text-blue-700 hover:text-blue-600'
                            )}
                            href={rightLink.url}
                        >
                            {rightLink.text}
                            <span aria-hidden="true"> &rarr;</span>
                        </a>
                    </p>
                </div>
            )}
            {text && (
                <div className="ml-3">
                    <p
                        className={clsx(
                            'text-sm',
                            type === 'warning' && 'text-yellow-700',
                            type === 'error' && 'text-red-700',
                            type === 'success' && 'text-green-700',
                            type === 'notice' && 'text-blue-700'
                        )}
                    >
                        {text}
                    </p>
                </div>
            )}

            {onDismiss && (
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            className={clsx(
                                'inline-flex rounded-md p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                                type === 'warning' &&
                                    'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
                                type === 'error' &&
                                    'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
                                type === 'success' &&
                                    'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
                                type === 'notice' &&
                                    'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
                            )}
                            onClick={onDismiss}
                            type="button"
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default Alert;
