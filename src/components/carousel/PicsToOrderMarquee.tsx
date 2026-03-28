"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useIsTouchDevice } from "@/lib/deviceDetect";

const picsToOrderImages = [
    { src: "/picstoorder/pic1.JPG", alt: "Картина 1" },
    { src: "/picstoorder/pic2.JPG", alt: "Картина 2" },
    { src: "/picstoorder/pic3.JPG", alt: "Картина 3" },
    { src: "/picstoorder/pic4.JPG", alt: "Картина 4" },
    { src: "/picstoorder/pic5.JPG", alt: "Картина 5" },
    { src: "/picstoorder/pic6.PNG", alt: "Картина 6" },
    { src: "/picstoorder/pic7.JPG", alt: "Картина 7" },
    { src: "/picstoorder/pic8.JPG", alt: "Картина 8" },
    { src: "/picstoorder/pic9.JPG", alt: "Картина 9" },
    { src: "/picstoorder/pic10.JPG", alt: "Картина 10" },
    { src: "/picstoorder/pic11.PNG", alt: "Картина 11" },
];

export function PicsToOrderMarquee({ children }: { children?: React.ReactNode }) {
    const isTouchDevice = useIsTouchDevice();
    // Derived once from pointer capability — never changes during session.
    const isDesktop = !isTouchDevice;
    const [isMobileTextboxVisible, setIsMobileTextboxVisible] = useState(true);
    const hideTextboxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [contentSize, setContentSize] = useState(0);

    // isDesktopRef: stable constant ref, no longer needs an effect to sync.
    const isDesktopRef = useRef(isDesktop);
    const isDraggingRef = useRef(isDragging);
    const contentSizeRef = useRef(contentSize);
    const rafRef = useRef<number | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);
    const setRef = useRef<HTMLDivElement>(null);

    const scrollOffset = useRef(0);
    const lastTimestamp = useRef(0);
    const dragStartPos = useRef(0);
    const dragStartOffset = useRef(0);

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

    // Sync isDragging and contentSize refs with state
    useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
    useEffect(() => { contentSizeRef.current = contentSize; }, [contentSize]);

    // No resize listener for device detection — isTouchDevice is evaluated once at load.

    useEffect(() => {
        if (!setRef.current) return;
        const updateSize = () => {
            if (setRef.current) {
                const size = isDesktopRef.current ? setRef.current.offsetWidth : setRef.current.offsetHeight;
                if (size > 0) {
                    setContentSize(size);
                }
            }
        };

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(setRef.current);
        updateSize();

        const interval = setInterval(updateSize, 1000);
        return () => {
            resizeObserver.disconnect();
            clearInterval(interval);
        };
    }, []); // Run once, uses refs

    const animate = useCallback((timestamp: number) => {
        if (!lastTimestamp.current) lastTimestamp.current = timestamp;
        const deltaTime = timestamp - lastTimestamp.current;
        lastTimestamp.current = timestamp;

        const size = contentSizeRef.current;
        const dragging = isDraggingRef.current;
        const desktop = isDesktopRef.current;

        if (size > 0 && contentRef.current) {
            // Autoplay only if not dragging AND no inertia is active
            if (!dragging && !inertiaRafRef.current) {
                const velocity = size / 72000;
                scrollOffset.current += velocity * deltaTime;
            }

            if (isNaN(scrollOffset.current)) {
                scrollOffset.current = 0;
            }

            scrollOffset.current = ((scrollOffset.current % size) + size) % size;

            if (desktop) {
                contentRef.current.style.transform = `translateX(-${scrollOffset.current}px)`;
            } else {
                contentRef.current.style.transform = `translateY(-${scrollOffset.current}px)`;
            }
        }

        rafRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTimestamp.current = 0;
            stopInertia();
        };
    }, [stopInertia, animate]); // Only one loop for the entire lifecycle

    // Handlers
    const handleDragStart = (pos: number) => {
        setIsDragging(true);
        isDraggingRef.current = true;
        stopInertia();

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            setIsMobileTextboxVisible(false);
        }

        dragStartPos.current = pos;
        dragStartOffset.current = scrollOffset.current;

        lastTimeRef.current = performance.now();
        lastPosRef.current = pos;
        velocityRef.current = 0;
    };

    const handleDragMove = (pos: number) => {
        if (!isDragging || contentSize <= 0) return;

        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const deltaPos = pos - lastPosRef.current;

        // Velocity (px / ms)
        velocityRef.current = deltaPos / dt;
        lastTimeRef.current = now;
        lastPosRef.current = pos;

        const delta = pos - dragStartPos.current;
        scrollOffset.current = dragStartOffset.current - delta;
    };

    const handleDragEnd = () => {
        if (!isDraggingRef.current) return;
        setIsDragging(false);
        isDraggingRef.current = false;
        lastTimestamp.current = 0; // Reset animation timer

        if (!isDesktop) {
            if (hideTextboxTimeoutRef.current) clearTimeout(hideTextboxTimeoutRef.current);
            hideTextboxTimeoutRef.current = setTimeout(() => {
                setIsMobileTextboxVisible(true);
            }, 1200);
        }

        // Start Inertia only if moved enough
        const dragDistance = Math.abs(lastPosRef.current - dragStartPos.current);
        if (dragDistance > 5 && Math.abs(velocityRef.current) > 0.1) {
            const friction = 0.95;
            let v = velocityRef.current;
            const maxV = 3;
            if (v > maxV) v = maxV;
            if (v < -maxV) v = -maxV;

            const step = () => {
                const size = contentSizeRef.current;
                if (size <= 0) {
                    inertiaRafRef.current = null;
                    return;
                }
                v *= friction;
                if (Math.abs(v) < 0.01) {
                    inertiaRafRef.current = null;
                    return;
                }

                // Apply velocity (flipped)
                scrollOffset.current -= v * 16;

                // Wrap is handled by animate() loop but we can do it here too for safety
                scrollOffset.current = ((scrollOffset.current % size) + size) % size;

                inertiaRafRef.current = requestAnimationFrame(step);
            };
            inertiaRafRef.current = requestAnimationFrame(step);
        }
    };

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => handleDragStart(isDesktop ? e.clientX : e.clientY);
    const handleMouseMove = (e: React.MouseEvent) => handleDragMove(isDesktop ? e.clientX : e.clientY);
    const handleMouseUp = () => handleDragEnd();

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => handleDragStart(isDesktop ? e.touches[0].clientX : e.touches[0].clientY);
    const handleTouchMove = (e: React.TouchEvent) => handleDragMove(isDesktop ? e.touches[0].clientX : e.touches[0].clientY);
    const handleTouchEnd = () => handleDragEnd();
    const handleTouchCancel = () => handleDragEnd();

    const handleManualScroll = (direction: 'prev' | 'next') => {
        if (contentSize <= 0) return;
        const step = contentSize / picsToOrderImages.length;
        const target = direction === 'prev' ? -step : step;
        scrollOffset.current += target;
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (contentSize <= 0) return;
        // On desktop, map vertical wheel (deltaY) OR horizontal wheel (deltaX) to scrolling
        // On trackpads, deltaX usually is larger for horizontal swipes. On mice, deltaY is present.
        const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        
        // Add minimal threshold to avoid micro-jitters
        if (Math.abs(amount) > 1) {
            scrollOffset.current += amount;
        }
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden md:py-2 group pointer-events-auto"
            style={{ touchAction: isDesktop ? 'pan-y' : 'none' }}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <div
                ref={contentRef}
                className={`flex ${isDesktop ? 'flex-row w-max h-full' : 'flex-col w-full h-max'}`}
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    willChange: 'transform'
                }}
            >
                {/* First set */}
                <div
                    ref={setRef}
                    className={`flex shrink-0 ${isDesktop ? 'flex-row gap-4 pb-0 px-2' : 'flex-col gap-3 pb-3'}`}
                >
                    {picsToOrderImages.map((img, i) => (
                        <div
                            key={`set1-${i}`}
                            className={`relative flex-shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-white/10 select-none pointer-events-none ${isDesktop ? 'mx-0 w-auto h-full' : 'mx-auto w-[calc(100vw-24px)]'}`}
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

                {/* Duplicated set (for seamless loop) */}
                <div aria-hidden className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                    {picsToOrderImages.map((img, i) => (
                        <div
                            key={`set2-${i}`}
                            className={`relative flex-shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-white/10 select-none pointer-events-none ${isDesktop ? 'mx-0 w-auto h-full' : 'mx-auto w-[calc(100vw-24px)]'}`}
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

            {/* Desktop Controls */}
            {isDesktop && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); handleManualScroll('prev'); }}
                        className="pointer-events-auto w-12 h-12 flex items-center justify-center text-white/80 hover:scale-110 hover:text-white transition-all active:scale-95"
                        title="Назад"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); handleManualScroll('next'); }}
                        className="pointer-events-auto w-12 h-12 flex items-center justify-center text-white/80 hover:scale-110 hover:text-white transition-all active:scale-95"
                        title="Вперед"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            )}

            {/* STICKY OVERLAY LAYER: Always centered, never scrolls */}
            {children && (
                <div
                    data-visible={isDesktop || isMobileTextboxVisible}
                    className={`group absolute inset-0 transition-all duration-300 ${isDesktop ? 'pointer-events-auto' : 'pointer-events-none'} ${(!isDesktop && !isMobileTextboxVisible) ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                >
                    <div className="relative z-20 w-full h-full flex justify-center">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

