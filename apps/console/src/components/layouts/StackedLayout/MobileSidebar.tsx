import { CloseButton, Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import type { PropsWithChildren } from 'react';
import { NavbarItem } from '@/components/common/NavBar';

export type MobileSidebarProps = PropsWithChildren<{ open: boolean; close: () => void }>;

function CloseMenuIcon() {
    return (
        <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
    );
}

const MobileSidebar = ({ open, close, children }: MobileSidebarProps) => (
    <Dialog open={open} onClose={close} className="lg:hidden">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <DialogPanel
            transition
            className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
            <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
                <div className="-mb-3 px-4 pt-3">
                    <CloseButton as={NavbarItem} aria-label="Close navigation">
                        <CloseMenuIcon />
                    </CloseButton>
                </div>
                {children}
            </div>
        </DialogPanel>
    </Dialog>
);

export default MobileSidebar;
