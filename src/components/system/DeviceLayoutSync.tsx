"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function DeviceLayoutSync() {
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Мы НЕ используем useIsTouchDevice() хук здесь во избежание мерцания.
        // Добавлен maxTouchPoints для правильного определения iPad в десктопном режиме.
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        
        const checkPointer = () => {
            const isTouch = mediaQuery.matches || 
                           (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
            if (isTouch) {
                document.documentElement.classList.remove("is-desktop");
                document.documentElement.classList.add("is-touch");
            } else {
                document.documentElement.classList.remove("is-touch");
                document.documentElement.classList.add("is-desktop");
            }
        };

        checkPointer();

        // Динамическое отслеживание при изменении свойств экрана
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', checkPointer);
        } else {
            mediaQuery.addListener(checkPointer);
        }

        // Live pointer interaction tracker: dynamically switches is-touch / is-desktop on first interaction (pointerdown or pointermove)
        const handlePointerActivity = (e: PointerEvent) => {
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                if (!document.documentElement.classList.contains("is-touch")) {
                    document.documentElement.classList.remove("is-desktop");
                    document.documentElement.classList.add("is-touch");
                }
            } else if (e.pointerType === 'mouse') {
                if (!document.documentElement.classList.contains("is-desktop")) {
                    document.documentElement.classList.remove("is-touch");
                    document.documentElement.classList.add("is-desktop");
                }
            }
        };

        window.addEventListener("pointerdown", handlePointerActivity, { passive: true });
        window.addEventListener("pointermove", handlePointerActivity, { passive: true });

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', checkPointer);
            } else {
                mediaQuery.removeListener(checkPointer);
            }
            window.removeEventListener("pointerdown", handlePointerActivity);
            window.removeEventListener("pointermove", handlePointerActivity);
        };
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
