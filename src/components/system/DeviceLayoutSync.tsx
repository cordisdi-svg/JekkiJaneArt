"use client";

import { useEffect } from "react";

export function DeviceLayoutSync() {
    useEffect(() => {
        // Мы НЕ используем useIsTouchDevice() хук здесь во избежание мерцания.
        // Добавлен maxTouchPoints для правильного определения iPad в десктопном режиме.
        const isTouch = window.matchMedia('(pointer: coarse)').matches || 
                       (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
        
        if (isTouch) {
            document.body.classList.add("is-touch");
        } else {
            document.body.classList.add("is-desktop");
        }
    }, []);

    return null;
}
