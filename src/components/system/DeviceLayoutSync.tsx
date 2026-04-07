"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function DeviceLayoutSync() {
    const pathname = usePathname();
    const isFirstRender = useRef(true);

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

    // 🌉 GLOBAL BRIDGE REMOVER: Удаляет скриншот-мост только КОГДА роутинг полностью завершился!
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const bridgeId = "transition-bridge";
        const bridge = document.getElementById(bridgeId);
        
        if (bridge) {
            // Ждём 400мс ПОСЛЕ ТОГО, как Next.js смонтировал новую страницу,
            // чтобы priority-картинки успели отрендериться, затем плавно скрываем
            setTimeout(() => {
                bridge.style.opacity = "0";
                setTimeout(() => {
                    const b = document.getElementById(bridgeId);
                    if (b && b.style.opacity === "0") b.remove();
                }, 700);
            }, 600);
        }
    }, [pathname]);

    return null;
}
