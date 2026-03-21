"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";

// Высота одного слайда = активная зона
const SLIDE_H = "calc(100svh - var(--nav-height-mobile))";

const slides = [
    { src: "/wear-and-shoes/1.png", alt: "Роспись одежды" },
    { src: "/wear-and-shoes/2.JPEG", alt: "Роспись обуви" },
    { src: "/wear-and-shoes/3.jpeg", alt: "Роспись одежды 3" },
    { src: "/wear-and-shoes/4.png", alt: "Роспись одежды 4" },
    { src: "/wear-and-shoes/5.png", alt: "Роспись одежды 5" },
];

export function WearMarquee({ children }: { children?: React.ReactNode }) {
    const [isDesktop, setIsDesktop] = useState(false);
    const [desktopIndex, setDesktopIndex] = useState(0);
    const [isMobileTextboxVisible, setIsMobileTextboxVisible] = useState(true);
    const hideTextboxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Mobile specific refs
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isInteracting = useRef(false);
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

    useEffect(() => {
        return () => {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
        };
    }, []);

    // 1. Desktop Detection
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    // 2. Desktop Handler
    const handleDesktopAdvance = useCallback(() => {
        setDesktopIndex((prev) => (prev + 1) % slides.length);
    }, []);

    // 3. Mobile Autoplay & Wrapping
    useEffect(() => {
        if (isDesktop) return;

        const animate = (time: number) => {
            if (lastTimeAnim.current === 0) {
                lastTimeAnim.current = time;
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }
            const deltaTime = time - lastTimeAnim.current;
            lastTimeAnim.current = time;

            if (containerRef.current && trackRef.current && !isInteracting.current && !inertiaRafRef.current) {
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
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            lastTimeAnim.current = 0;
            stopInertia();
        };
    }, [isDesktop, stopInertia]);

    // 4. Mobile Pointer Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isDesktop || !containerRef.current || !trackRef.current) return;
        isInteracting.current = true;
        stopInertia();

        if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
        setIsMobileTextboxVisible(false);

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

        if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
        hideTextboxTimeoutRef.current = setTimeout(() => {
            setIsMobileTextboxVisible(true);
        }, 500);

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
                />
            </button>
        );
    }

    // ─── MOBILE VIEW ───
    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden block"
            style={{ height: SLIDE_H, touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
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
                        />
                    </div>
                ))}
            </div>

            {/* STICKY OVERLAY LAYER: Always centered, never scrolls */}
            {children && (
                <div 
                    data-visible={isDesktop || isMobileTextboxVisible}
                    className={`group absolute inset-0 flex items-center items-start pt-4 pointer-events-none transition-all duration-300 ${(!isDesktop && !isMobileTextboxVisible) ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                >
                    <div className="relative z-20 w-full flex justify-center h-full">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
