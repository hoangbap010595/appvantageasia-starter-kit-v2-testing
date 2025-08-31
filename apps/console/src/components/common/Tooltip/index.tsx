import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react';
import { clsx } from 'clsx';
import type { ReactNode, Ref } from 'react';
import { Fragment, useRef } from 'react';

const timeoutDuration = 120;

interface TooltipProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    labelClassName?: string;
}

const Tooltip = ({ className, title, children, labelClassName }: TooltipProps) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const timeOutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleEnter = (isOpen: boolean) => {
        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
            timeOutRef.current = null;
        }

        if (!isOpen) {
            triggerRef.current?.click();
        }
    };

    const handleLeave = (isOpen: boolean) => {
        timeOutRef.current = setTimeout(() => {
            if (isOpen) {
                triggerRef.current?.click();
            }
        }, timeoutDuration);
    };

    return (
        <Popover className={clsx('relative', className)}>
            {({ open }) => (
                <div onMouseEnter={() => handleEnter(open)} onMouseLeave={() => handleLeave(open)}>
                    <PopoverButton ref={triggerRef as Ref<HTMLButtonElement>} as="div" className={labelClassName}>
                        {children}
                    </PopoverButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel className="absolute bottom-full left-1/2 mb-2 inline-block w-max max-w-80 -translate-x-1/2 transform rounded-md bg-black px-4 py-2 text-white normal-case">
                            {title}
                            <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-solid border-t-black border-r-transparent border-l-transparent" />
                        </PopoverPanel>
                    </Transition>
                </div>
            )}
        </Popover>
    );
};

export default Tooltip;
