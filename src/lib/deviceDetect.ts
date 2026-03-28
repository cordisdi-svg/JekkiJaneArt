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
