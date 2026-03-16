"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

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

export function PicsToOrderMarquee() {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [contentSize, setContentSize] = useState(0);

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

    // Sync refs with state
    useEffect(() => { isDesktopRef.current = isDesktop; }, [isDesktop]);
    useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
    useEffect(() => { contentSizeRef.current = contentSize; }, [contentSize]);

    useEffect(() => {
        const checkMatch = () => setIsDesktop(window.innerWidth >= 768);
        checkMatch();
        window.addEventListener("resize", checkMatch);
        return () => window.removeEventListener("resize", checkMatch);
    }, []);

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

    const animate = (timestamp: number) => {
        if (!lastTimestamp.current) lastTimestamp.current = timestamp;
        const deltaTime = timestamp - lastTimestamp.current;
        lastTimestamp.current = timestamp;

        const size = contentSizeRef.current;
        const dragging = isDraggingRef.current;
        const desktop = isDesktopRef.current;

        if (size > 0 && contentRef.current) {
            if (!dragging) {
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
    };

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTimestamp.current = 0;
        };
    }, []); // Only one loop for the entire lifecycle

    // Handlers
    const handleDragStart = (pos: number) => {
        setIsDragging(true);
        dragStartPos.current = pos;
        dragStartOffset.current = scrollOffset.current;
    };

    const handleDragMove = (pos: number) => {
        if (!isDragging || contentSize <= 0) return;
        const delta = pos - dragStartPos.current;
        scrollOffset.current = dragStartOffset.current - delta;
    };

    const handleDragEnd = () => setIsDragging(false);

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
        const delta = isDesktop ? e.deltaX : e.deltaY;
        const otherDelta = isDesktop ? e.deltaY : e.deltaX;
        if (Math.abs(delta) > Math.abs(otherDelta)) {
            scrollOffset.current += delta;
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
                className="flex flex-col md:flex-row w-full md:w-max h-max md:h-full"
                style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab',
                    willChange: 'transform'
                }}
            >
                {/* First set */}
                <div 
                    ref={setRef}
                    className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2"
                >
                    {picsToOrderImages.map((img, i) => (
                        <div
                            key={`set1-${i}`}
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 select-none pointer-events-none"
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
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 select-none pointer-events-none"
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
                        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white/80 hover:bg-black/40 hover:text-white transition-all active:scale-95 shadow-lg"
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
                        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white/80 hover:bg-black/40 hover:text-white transition-all active:scale-95 shadow-lg"
                        title="Вперед"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

