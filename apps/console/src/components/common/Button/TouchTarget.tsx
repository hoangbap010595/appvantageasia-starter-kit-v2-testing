import type { ReactNode } from 'react';

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
const TouchTarget = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <span
                className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                aria-hidden="true"
            />
            {children}
        </>
    );
};

export default TouchTarget;
