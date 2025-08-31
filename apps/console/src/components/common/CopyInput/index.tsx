import { Button, Transition } from '@headlessui/react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InputProps } from '@/components/common/Input';
import Input from '@/components/common/Input';

export type CopyInputProps = Pick<InputProps, 'name' | 'value' | 'label' | 'helpElement'>;

const CopyInput = (props: CopyInputProps) => {
    const { t } = useTranslation('common');
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(props.value!.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [setCopied, props.value]);

    const suffixElement = (
        <Button
            aria-label={copied ? 'Copied!' : 'Copy code'}
            type="button"
            className="relative inset-y-0 flex shrink-0 cursor-pointer items-center px-0 text-gray-400 shadow-inherit hover:text-gray-500"
            onClick={handleCopy}
        >
            {copied ? <CheckIcon className="h-5 w-5 text-green-700" /> : <ClipboardDocumentIcon className="h-5 w-5" />}

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
        </Button>
    );

    return <Input {...props} onClick={handleCopy} type="text" readOnly disabled suffixElement={suffixElement} />;
};

export default CopyInput;
