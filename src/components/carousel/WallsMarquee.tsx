"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

const wallsImages = [
    { src: '/walls/1.png', alt: 'Роспись 1' },
    { src: '/walls/2.png', alt: 'Роспись 2' },
    { src: '/walls/3.png', alt: 'Роспись 3' },
    { src: '/walls/4.png', alt: 'Роспись 4' },
    { src: '/walls/5.jpg', alt: 'Роспись 5' },
];

export function WallsMarquee({ children }: { children?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    // Interaction states
    const isInteracting = useRef(false);
    const [isMobileTextboxVisible, setIsMobileTextboxVisible] = useState(true);
    const hideTextboxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startPos = useRef({ x: 0, y: 0 });
    const lastPointerX = useRef(0);
    const initialScroll = useRef({ left: 0, top: 0 });

    // Momentum refs
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(0);
    const lastPosRef = useRef(0);
    const inertiaRafRef = useRef<number | null>(null);

    const animationFrameId = useRef<number | null>(null);
    const lastTimeAnim = useRef<number>(0);

    const stopInertia = useCallback(() => {
        if (inertiaRafRef.current) {
            cancelAnimationFrame(inertiaRafRef.current);
            inertiaRafRef.current = null;
        }
    }, []);

    const getSpeed = useCallback(() => {
        if (!marqueeRef.current) return 0.05;
        const size = isDesktop ? marqueeRef.current.scrollWidth : marqueeRef.current.scrollHeight;
        // 41s for a full loop-set move
        return (size / 2) / 41000;
    }, [isDesktop]);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        const animate = (time: number) => {
            if (lastTimeAnim.current === 0) {
                lastTimeAnim.current = time;
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }
            const deltaTime = time - lastTimeAnim.current;
            lastTimeAnim.current = time;

            if (containerRef.current && marqueeRef.current && !isInteracting.current && !inertiaRafRef.current) {
                const container = containerRef.current;
                const marquee = marqueeRef.current;
                const speed = getSpeed();

                if (isDesktop) {
                    container.scrollLeft += speed * deltaTime;
                    const setWidth = marquee.scrollWidth / 2;
                    if (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
                    else if (container.scrollLeft < 0) container.scrollLeft += setWidth;
                } else {
                    container.scrollTop += speed * deltaTime;
                    const setHeight = marquee.scrollHeight / 2;
                    if (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
                    else if (container.scrollTop < 0) container.scrollTop += setHeight;
                }
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isDesktop, getSpeed]);

    useEffect(() => {
        return () => {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            stopInertia();
        };
    }, [stopInertia]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!containerRef.current || !marqueeRef.current) return;
        isInteracting.current = true;
        stopInertia();

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            setIsMobileTextboxVisible(false);
        }

        const container = containerRef.current;
        const marquee = marqueeRef.current;

        // Pre-normalize scroll position so we always start drag from a valid single-set range
        if (isDesktop) {
            const setWidth = marquee.scrollWidth / 2;
            while (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
            while (container.scrollLeft < 0) container.scrollLeft += setWidth;

            // Edge Guard: Shift away from boundaries to avoid hitting physical scroll limits
            if (container.scrollLeft <= 1) {
                container.scrollLeft += setWidth;
            } else if (container.scrollLeft >= setWidth - 1) {
                container.scrollLeft -= setWidth;
            }
        } else {
            const setHeight = marquee.scrollHeight / 2;
            while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
            while (container.scrollTop < 0) container.scrollTop += setHeight;
        }

        container.setPointerCapture(e.pointerId);
        startPos.current = { x: e.clientX, y: e.clientY };

        lastTimeRef.current = performance.now();
        lastPosRef.current = isDesktop ? e.clientX : e.clientY;
        velocityRef.current = 0;

        if (isDesktop) {
            lastPointerX.current = e.clientX;
        }
        initialScroll.current = {
            left: container.scrollLeft,
            top: container.scrollTop
        };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isInteracting.current || !containerRef.current || !marqueeRef.current) return;

        const dy = e.clientY - startPos.current.y;
        const marquee = marqueeRef.current;
        const container = containerRef.current;

        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const currentPos = isDesktop ? e.clientX : e.clientY;
        const deltaPos = currentPos - lastPosRef.current;

        // Velocity (px / ms)
        velocityRef.current = deltaPos / dt;
        lastTimeRef.current = now;
        lastPosRef.current = currentPos;

        if (isDesktop) {
            const setWidth = marquee.scrollWidth / 2;

            // Pre-normalization & Edge Guard before calculating delta
            while (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
            while (container.scrollLeft < 0) container.scrollLeft += setWidth;

            if (container.scrollLeft <= 1) {
                container.scrollLeft += setWidth;
            } else if (container.scrollLeft >= setWidth - 1) {
                container.scrollLeft -= setWidth;
            }

            const deltaX = e.clientX - lastPointerX.current;
            let newScrollLeft = container.scrollLeft - deltaX;

            // Normalize result
            while (newScrollLeft >= setWidth) newScrollLeft -= setWidth;
            while (newScrollLeft < 0) newScrollLeft += setWidth;

            container.scrollLeft = newScrollLeft;
            lastPointerX.current = e.clientX;
        } else {
            const setHeight = marquee.scrollHeight / 2;
            let newScrollTop = initialScroll.current.top - dy;

            // Normalize result only, do NOT touch initialScroll.current
            while (newScrollTop >= setHeight) newScrollTop -= setHeight;
            while (newScrollTop < 0) newScrollTop += setHeight;

            container.scrollTop = newScrollTop;
        }
    };

    const handlePointerUp = () => {
        isInteracting.current = false;
        lastTimeAnim.current = 0; // Reset animation timer to avoid jumps

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            hideTextboxTimeoutRef.current = setTimeout(() => {
                setIsMobileTextboxVisible(true);
            }, 500);
        }

        // Start Inertia
        if (Math.abs(velocityRef.current) > 0.1) {
            const friction = 0.95;
            let v = velocityRef.current;
            // Clamp max velocity for sanity
            const maxV = 3;
            if (v > maxV) v = maxV;
            if (v < -maxV) v = -maxV;

            const step = () => {
                if (!containerRef.current || !marqueeRef.current) {
                    inertiaRafRef.current = null;
                    return;
                }
                v *= friction;
                if (Math.abs(v) < 0.01) {
                    inertiaRafRef.current = null;
                    return;
                }

                const container = containerRef.current;
                const marquee = marqueeRef.current;

                if (isDesktop) {
                    const setWidth = marquee.scrollWidth / 2;
                    // Apply velocity (flipped because scroll direction and pointer delta are opposite in logic)
                    container.scrollLeft -= v * 16;

                    while (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
                    while (container.scrollLeft < 0) container.scrollLeft += setWidth;
                } else {
                    const setHeight = marquee.scrollHeight / 2;
                    container.scrollTop -= v * 16;

                    while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
                    while (container.scrollTop < 0) container.scrollTop += setHeight;
                }

                inertiaRafRef.current = requestAnimationFrame(step);
            };
            inertiaRafRef.current = requestAnimationFrame(step);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (!containerRef.current || !marqueeRef.current) return;
        const container = containerRef.current;
        const marquee = marqueeRef.current;

        if (isDesktop) {
            const setWidth = marquee.scrollWidth / 2;

            // Edge Guard: Shift away from boundaries before applying wheel delta
            while (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
            while (container.scrollLeft < 0) container.scrollLeft += setWidth;

            if (container.scrollLeft <= 1) {
                container.scrollLeft += setWidth;
            } else if (container.scrollLeft >= setWidth - 1) {
                container.scrollLeft -= setWidth;
            }

            container.scrollLeft += (e.deltaY || e.deltaX);

            // Normalize result
            while (container.scrollLeft >= setWidth) container.scrollLeft -= setWidth;
            while (container.scrollLeft < 0) container.scrollLeft += setWidth;
        } else {
            const setHeight = marquee.scrollHeight / 2;
            container.scrollTop += e.deltaY;

            while (container.scrollTop >= setHeight) container.scrollTop -= setHeight;
            while (container.scrollTop < 0) container.scrollTop += setHeight;
        }
    };

    return (
        <div
            className={`marquee-wrapper relative w-full h-full py-0 md:py-2 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto`}
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
        >
            <style jsx>{`
                .marquee-container {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .marquee-container::-webkit-scrollbar {
                    display: none;
                }
                .run-marquee {
                    display: flex;
                    flex-direction: column;
                }
                @media (min-width: 768px) {
                    .run-marquee {
                        flex-direction: row;
                        width: max-content;
                        height: 100%;
                    }
                }
            `}</style>

            {/* SCROLL LAYER: Isolated from fixed overlay */}
            <div ref={containerRef} className="marquee-container relative w-full h-full overflow-hidden">
                <div ref={marqueeRef} className="run-marquee h-full">

                    {/* Первый сет */}
                    <div className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                        {wallsImages.map((img, i) => (
                            <div
                                key={`set1-${i}`}
                                className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10"
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    sizes="(max-width: 768px) calc(100vw - 24px), 40vw"
                                    className="object-cover"
                                    priority
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Дублированный сет (для петли) */}
                    <div aria-hidden className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                        {wallsImages.map((img, i) => (
                            <div
                                key={`set2-${i}`}
                                className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10"
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    sizes="(max-width: 768px) calc(100vw - 24px), 40vw"
                                    className="object-cover"
                                    priority
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* STICKY OVERLAY LAYER: Always centered, never scrolls */}
            {children && (
                <div 
                    data-visible={isDesktop || isMobileTextboxVisible}
                    className={`group absolute inset-0 flex items-center justify-center pointer-events-none md:pointer-events-auto transition-all duration-300 ${(!isDesktop && !isMobileTextboxVisible) ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                >
                    <div className="relative z-20 w-full flex justify-center">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}


