"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useIsTouchDevice } from "@/lib/deviceDetect";
import { useHintCounter } from "@/lib/useHintCounter";

// Высота одного слайда = активная зона
const SLIDE_H = "calc(100svh - var(--nav-height-mobile))";

const slides = [
    { src: "/wear-and-shoes/1.webp", alt: "Роспись одежды" },
    { src: "/wear-and-shoes/2.webp", alt: "Роспись обуви" },
    { src: "/wear-and-shoes/3.webp", alt: "Роспись одежды 3" },
    { src: "/wear-and-shoes/4.webp", alt: "Роспись одежды 4" },
    { src: "/wear-and-shoes/5.webp", alt: "Роспись одежды 5" },
];

export function WearMarquee({ children }: { children?: React.ReactNode }) {
    const isTouchDevice = useIsTouchDevice();
    // Derived once from pointer capability — never changes during session.
    const isDesktop = !isTouchDevice;
    const [desktopIndex, setDesktopIndex] = useState(0);

    // Hint counter — hide "листай" after 3 mobile scrolls
    const { visible: scrollHintVisible, increment: incrementScrollHint } = useHintCounter('wear_scroll');

    // Mobile specific refs
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isInteracting = useRef(false);

    // Interaction states
    const [isMobileTextboxVisible, setIsMobileTextboxVisible] = useState(true);
    const hideTextboxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startY = useRef(0);
    const initialScrollTop = useRef(0);
    const lastTimeAnim = useRef<number>(0);
    const animationFrameId = useRef<number>(0);

    // Momentum refs
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(0);
    const lastPosRef = useRef(0);
    const inertiaRafRef = useRef<number | null>(null);

    const stopInertia = useCallback(() => {
        if (inertiaRafRef.current) {
            cancelAnimationFrame(inertiaRafRef.current);
            inertiaRafRef.current = null;
        }
    }, []);

    // No resize listener for device detection — isTouchDevice is evaluated once at load.

    // 2. Desktop Handler
    const handleDesktopAdvance = useCallback(() => {
        setDesktopIndex((prev) => (prev + 1) % slides.length);
    }, []);

    // 3. Mobile Autoplay & Wrapping
    const mountTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isDesktop) return;

        const animate = (time: number) => {
            if (lastTimeAnim.current === 0) {
                lastTimeAnim.current = time;
                if (!mountTimeRef.current) mountTimeRef.current = performance.now();
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }
            const deltaTime = time - lastTimeAnim.current;
            lastTimeAnim.current = time;

            if (containerRef.current && trackRef.current && !isInteracting.current && !inertiaRafRef.current) {
                // Задержка движения на 1200мс (ждём растворения моста-заглушки)
                if (mountTimeRef.current && performance.now() - mountTimeRef.current > 1200) {
                    const container = containerRef.current;
                    const track = trackRef.current;
                    const setHeight = track.scrollHeight / 2;

                    if (setHeight > 0) {
                        // Speed calculation: loop in 41s
                        const speed = setHeight / 41000;
                        container.scrollTop += speed * deltaTime;

                        // Seamless wrap
                        if (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
                        else if (container.scrollTop < 0) container.scrollTop += setHeight;
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            lastTimeAnim.current = 0;
            stopInertia();
        };
    }, [stopInertia, isDesktop]);

    useEffect(() => {
        return () => {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            stopInertia();
        };
    }, [stopInertia]);

    // 4. Mobile Pointer Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isDesktop || !containerRef.current || !trackRef.current) return;
        isInteracting.current = true;
        stopInertia();
        incrementScrollHint();

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            setIsMobileTextboxVisible(false);
        }

        const container = containerRef.current;
        const track = trackRef.current;
        const setHeight = track.scrollHeight / 2;

        // Normalize before drag
        while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
        while (container.scrollTop < 0) container.scrollTop += setHeight;

        container.setPointerCapture(e.pointerId);
        startY.current = e.clientY;
        initialScrollTop.current = container.scrollTop;

        lastTimeRef.current = performance.now();
        lastPosRef.current = e.clientY;
        velocityRef.current = 0;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isInteracting.current || !containerRef.current || !trackRef.current) return;

        const dy = e.clientY - startY.current;
        const container = containerRef.current;
        const track = trackRef.current;
        const setHeight = track.scrollHeight / 2;

        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const currentPos = e.clientY;
        const deltaPos = currentPos - lastPosRef.current;

        velocityRef.current = deltaPos / dt;
        lastTimeRef.current = now;
        lastPosRef.current = currentPos;

        let newScrollTop = initialScrollTop.current - dy;

        // Normalize result
        while (newScrollTop >= setHeight) newScrollTop -= setHeight;
        while (newScrollTop < 0) newScrollTop += setHeight;

        container.scrollTop = newScrollTop;
    };

    const handlePointerUp = () => {
        isInteracting.current = false;
        lastTimeAnim.current = 0;

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            hideTextboxTimeoutRef.current = setTimeout(() => {
                setIsMobileTextboxVisible(true);
            }, 1500);
        }

        // Start Inertia
        if (Math.abs(velocityRef.current) > 0.1) {
            const friction = 0.95;
            let v = velocityRef.current;
            const maxV = 3;
            if (v > maxV) v = maxV;
            if (v < -maxV) v = -maxV;

            const step = () => {
                if (!containerRef.current || !trackRef.current) {
                    inertiaRafRef.current = null;
                    return;
                }
                v *= friction;
                if (Math.abs(v) < 0.01) {
                    inertiaRafRef.current = null;
                    return;
                }

                const container = containerRef.current;
                const track = trackRef.current;
                const setHeight = track.scrollHeight / 2;

                container.scrollTop -= v * 16;

                while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
                while (container.scrollTop < 0) container.scrollTop += setHeight;

                inertiaRafRef.current = requestAnimationFrame(step);
            };
            inertiaRafRef.current = requestAnimationFrame(step);
        }
    };

    // ─── DESKTOP VIEW ───
    if (isDesktop) {
        const slide = slides[desktopIndex];
        return (
            <button
                type="button"
                className="relative w-full overflow-hidden block border-none p-0 m-0 bg-transparent cursor-pointer"
                style={{ height: SLIDE_H }}
                onClick={handleDesktopAdvance}
                aria-label="Следующее изображение"
            >
                <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    unoptimized />
            </button>
        );
    }

    // ─── MOBILE VIEW ───
    return (
        <div
            className="marquee-wrapper relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{ height: SLIDE_H, touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {/* Mobile Finger Hint ("листай") */}
            <div className="hide-on-desktop absolute bottom-[8%] left-[4%] pointer-events-none" style={{ zIndex: 100, visibility: scrollHintVisible ? 'visible' : 'hidden' }}>
                <div className="mobile-hint-finger flex flex-col items-center">
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.7)" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-10 h-10 drop-shadow-md"
                    >
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                    <span className="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-comfortaa font-bold" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                        листай
                    </span>
                </div>
            </div>
            <div ref={containerRef} className="relative w-full h-full overflow-hidden">
                <div ref={trackRef} className="flex flex-col">
                    {[...slides, ...slides].map((slide, i) => (
                        <div
                            key={i}
                            className="relative flex-shrink-0 w-full"
                            style={{ height: SLIDE_H }}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority={i < 2}
                                unoptimized />
                        </div>
                    ))}
                </div>
            </div>

            {/* STICKY OVERLAY LAYER: Always centered, never scrolls */}
            {children && (
                <div
                    data-visible={isDesktop || isMobileTextboxVisible}
                    className={`group absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDesktop ? 'pointer-events-auto' : 'pointer-events-none'} ${(!isDesktop && !isMobileTextboxVisible) ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                >
                    <div className="relative z-20 w-full flex justify-center h-full">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
