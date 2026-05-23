import { useState, useEffect } from 'react';

/**
 * React hook that stably detects touch devices while being SSR and hydration safe.
 * It defaults to `true` (mobile layout) on the server to prevent Desktop -> Mobile
 * hydration layout jumping, assuming mobile-first logic.
 */
export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsTouch(window.matchMedia('(pointer: coarse)').matches);
        }
    }, []);

    return isTouch;
}

/**
 * Hydration-safe React hook that detects if the screen is large enough for desktop layouts.
 * Prevents mobile layout rendering on wide touch devices like touchscreen laptops and iPads.
 */
export function useIsDesktopLayout(breakpoint = 768) {
    // We default to false (mobile-first) on the server to be safe,
    // and immediately sync with the actual window size on mount.
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setIsDesktop(window.innerWidth >= breakpoint);
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [breakpoint]);

    return isDesktop;
}

