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

export function WearMarquee() {
    const [isDesktop, setIsDesktop] = useState(false);
    const [desktopIndex, setDesktopIndex] = useState(0);

    // Mobile specific refs
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isInteracting = useRef(false);
    const startY = useRef(0);
    const initialScrollTop = useRef(0);
    const lastTime = useRef<number>(0);
    const animationFrameId = useRef<number>(0);

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
            if (lastTime.current === 0) {
                lastTime.current = time;
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }
            const deltaTime = time - lastTime.current;
            lastTime.current = time;

            if (containerRef.current && trackRef.current && !isInteracting.current) {
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
            lastTime.current = 0;
        };
    }, [isDesktop]);

    // 4. Mobile Pointer Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isDesktop || !containerRef.current || !trackRef.current) return;
        isInteracting.current = true;

        const container = containerRef.current;
        const track = trackRef.current;
        const setHeight = track.scrollHeight / 2;

        // Normalize before drag
        while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
        while (container.scrollTop < 0) container.scrollTop += setHeight;

        container.setPointerCapture(e.pointerId);
        startY.current = e.clientY;
        initialScrollTop.current = container.scrollTop;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isInteracting.current || !containerRef.current || !trackRef.current) return;

        const dy = e.clientY - startY.current;
        const container = containerRef.current;
        const track = trackRef.current;
        const setHeight = track.scrollHeight / 2;

        let newScrollTop = initialScrollTop.current - dy;

        // Normalize result
        while (newScrollTop >= setHeight) newScrollTop -= setHeight;
        while (newScrollTop < 0) newScrollTop += setHeight;

        container.scrollTop = newScrollTop;
    };

    const handlePointerUp = () => {
        isInteracting.current = false;
        lastTime.current = 0;
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
        </div>
    );
}
