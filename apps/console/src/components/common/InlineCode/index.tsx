import { Transition } from '@headlessui/react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface InlineCodeProps {
    children: string;
}

const InlineCode = ({ children }: InlineCodeProps) => {
    const { t } = useTranslation('common');
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [setCopied, children]);

    return (
        <span className="group relative inline-flex items-center rounded border border-pink-200 bg-pink-50 px-1.5 py-0.5 text-sm text-pink-800">
            <code className="font-mono">{children}</code>
            <button
                aria-label={copied ? 'Copied!' : 'Copy code'}
                className="relative ml-1.5 rounded-md p-1 text-pink-400 transition-colors hover:text-pink-600"
                onClick={handleCopy}
                type="button"
            >
                {copied ? (
                    <CheckIcon className="h-5 w-5 text-green-700" />
                ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                )}

                {/* Popover message */}
                <Transition
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    show={copied}
                >
                    <div className="absolute top-0 left-8 transform whitespace-nowrap">
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 transform">
                                <div className="h-2 w-2 -translate-y-1 rotate-45 transform bg-gray-700" />
                            </div>
                            <div className="rounded bg-gray-700 px-2 py-1 text-xs text-white shadow-lg">
                                {t('common:copiedToClipboard')}
                            </div>
                        </div>

                        {/* Arrow */}
                    </div>
                </Transition>
            </button>
        </span>
    );
};

export default InlineCode;
