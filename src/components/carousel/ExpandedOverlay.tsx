"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PaintingData } from "@/data/availablePics";

// ─── Expanded overlay (covers full viewport including nav) ────────────────────
export function ExpandedOverlay({ item, onClose }: { item: PaintingData; onClose: () => void }) {
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const autoscrollPausedRef = useRef(false);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);

    const isDraggingRef = useRef(false);
    const startYRef = useRef(0);
    const initialScrollTopRef = useRef(0);
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(0);
    const lastPosRef = useRef(0);
    const inertiaRafRef = useRef<number | null>(null);

    // Magnifier and Interaction Refs
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const magnifierRef = useRef<HTMLDivElement>(null);
    const zoomedImageRef = useRef<HTMLImageElement>(null);
    
    const visibleRectRef = useRef<{ left: number, top: number, width: number, height: number, intrinsicWidth: number, intrinsicHeight: number } | null>(null);
    const magnifierActiveRef = useRef(false);
    const activePointerIdRef = useRef<number | null>(null);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hoverDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const suppressClickRef = useRef(false);
    const pointerCoordsRef = useRef({ x: 0, y: 0 });
    const rafTrackingRef = useRef<number | null>(null);

    const stopInertia = useCallback(() => {
        if (inertiaRafRef.current) {
            cancelAnimationFrame(inertiaRafRef.current);
            inertiaRafRef.current = null;
        }
    }, []);

    const pauseAutoscroll = useCallback(() => {
        autoscrollPausedRef.current = true;
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    }, []);

    const resumeAutoscroll = useCallback(() => {
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = setTimeout(() => {
            autoscrollPausedRef.current = false;
        }, 4000);
    }, []);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", h);
        document.body.classList.add("overlay-open");

        // Autoscroll logic
        const scrollStep = () => {
            const el = scrollRef.current;
            if (el && !autoscrollPausedRef.current && !isDraggingRef.current && !inertiaRafRef.current) {
                if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) {
                    el.scrollTop += 0.5;
                }
            }
            rafRef.current = requestAnimationFrame(scrollStep);
        };
        rafRef.current = requestAnimationFrame(scrollStep);

        return () => {
            window.removeEventListener("keydown", h);
            document.body.classList.remove("overlay-open");
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
            stopInertia();
        };
    }, [onClose, stopInertia]); 

    // ─── Magnifier Logic ───
    const calcGeometry = useCallback(() => {
        if (!imageContainerRef.current || !visibleRectRef.current?.intrinsicWidth) return;
        const containerRect = imageContainerRef.current.getBoundingClientRect();
        const { intrinsicWidth, intrinsicHeight } = visibleRectRef.current;
        
        const containerAspect = containerRect.width / containerRect.height;
        const imageAspect = intrinsicWidth / intrinsicHeight;

        let renderWidth, renderHeight;
        if (imageAspect > containerAspect) {
            renderWidth = containerRect.width;
            renderHeight = containerRect.width / imageAspect;
        } else {
            renderHeight = containerRect.height;
            renderWidth = containerRect.height * imageAspect;
        }

        const renderLeft = containerRect.left + (containerRect.width - renderWidth) / 2;
        const renderTop = containerRect.top + (containerRect.height - renderHeight) / 2;

        visibleRectRef.current = {
            left: renderLeft,
            top: renderTop,
            width: renderWidth,
            height: renderHeight,
            intrinsicWidth,
            intrinsicHeight
        };

        if (zoomedImageRef.current) {
            zoomedImageRef.current.style.width = `${renderWidth}px`;
            zoomedImageRef.current.style.height = `${renderHeight}px`;
        }
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => calcGeometry(), 100);
        });
        if (imageContainerRef.current) {
            resizeObserver.observe(imageContainerRef.current);
        }
        window.addEventListener('resize', calcGeometry);
        window.addEventListener('orientationchange', calcGeometry);
        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calcGeometry);
            window.removeEventListener('orientationchange', calcGeometry);
            hideMagnifier();
        };
    }, [calcGeometry]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        visibleRectRef.current = {
            left: 0, top: 0, width: 0, height: 0,
            intrinsicWidth: target.naturalWidth,
            intrinsicHeight: target.naturalHeight
        };
        calcGeometry();
    };

    const updateMagnifierDOM = () => {
        if (!magnifierRef.current || !zoomedImageRef.current || !visibleRectRef.current) return;
        const rect = visibleRectRef.current;
        const { x, y } = pointerCoordsRef.current;

        const clampedX = Math.max(rect.left, Math.min(x, rect.left + rect.width));
        const clampedY = Math.max(rect.top, Math.min(y, rect.top + rect.height));

        const magSize = window.innerWidth < 768 ? 184 : 230; 

        // Center on X, but slightly above Y so finger doesn't block it
        const magX = clampedX - magSize / 2;
        const magY = clampedY - magSize / 2 - (magSize / 2 + 10);

        magnifierRef.current.style.transform = `translate3d(${magX}px, ${magY}px, 0)`;
        magnifierRef.current.style.width = `${magSize}px`;
        magnifierRef.current.style.height = `${magSize}px`;

        const zoom = 2;
        const relX = clampedX - rect.left;
        const relY = clampedY - rect.top;

        const zoomedX = relX * zoom;
        const zoomedY = relY * zoom;

        // Position inner zoomed image so that the coordinate (zoomedX, zoomedY) is at the center of the magnifier
        const transX = (magSize / 2) - zoomedX;
        const transY = (magSize / 2) - zoomedY;

        // Clamp translation so we do not show empty pixels out of bounds
        const maxTransX = 0;
        const minTransX = magSize - (rect.width * zoom);
        const finalTransX = minTransX > maxTransX ? (magSize - rect.width * zoom) / 2 : Math.max(minTransX, Math.min(maxTransX, transX));

        const maxTransY = 0;
        const minTransY = magSize - (rect.height * zoom);
        const finalTransY = minTransY > maxTransY ? (magSize - rect.height * zoom) / 2 : Math.max(minTransY, Math.min(maxTransY, transY));

        zoomedImageRef.current.style.transform = `translate3d(${finalTransX}px, ${finalTransY}px, 0) scale(${zoom})`;
    };

    const toggleMagnifierDOM = (visible: boolean) => {
        if (!magnifierRef.current) return;
        magnifierActiveRef.current = visible;
        if (visible) {
            magnifierRef.current.style.opacity = '1';
            magnifierRef.current.style.visibility = 'visible';
            if (!rafTrackingRef.current) {
                const track = () => {
                    if (!magnifierActiveRef.current) {
                        rafTrackingRef.current = null;
                        return;
                    }
                    updateMagnifierDOM();
                    rafTrackingRef.current = requestAnimationFrame(track);
                };
                rafTrackingRef.current = requestAnimationFrame(track);
            }
        } else {
            magnifierRef.current.style.opacity = '0';
            magnifierRef.current.style.visibility = 'hidden';
            if (rafTrackingRef.current) {
                cancelAnimationFrame(rafTrackingRef.current);
                rafTrackingRef.current = null;
            }
        }
    };

    const isInsideVisibleRect = (x: number, y: number) => {
        if (!visibleRectRef.current) return false;
        const r = visibleRectRef.current;
        return (x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height);
    };

    const hideMagnifier = () => {
        toggleMagnifierDOM(false);
        if (hoverDelayTimerRef.current) clearTimeout(hoverDelayTimerRef.current);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
        if (activePointerIdRef.current !== null && imageContainerRef.current) {
            try { imageContainerRef.current.releasePointerCapture(activePointerIdRef.current); } catch(e){}
            activePointerIdRef.current = null;
        }
    };

    const handlePointerDownImage = (e: React.PointerEvent) => {
        if (!e.isPrimary || activePointerIdRef.current !== null) return;
        if (e.pointerType === 'mouse') return; // Desktop handled via hover
        if (!isInsideVisibleRect(e.clientX, e.clientY)) return;

        activePointerIdRef.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        pointerCoordsRef.current = { x: e.clientX, y: e.clientY };

        pressTimerRef.current = setTimeout(() => {
            toggleMagnifierDOM(true);
        }, 300); // 300ms mobile activation delay
    };

    const handlePointerMoveImage = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') {
            if (isInsideVisibleRect(e.clientX, e.clientY)) {
                pointerCoordsRef.current = { x: e.clientX, y: e.clientY };
                if (!magnifierActiveRef.current && !hoverDelayTimerRef.current) {
                    // Hover tiny delay optimized for responsiveness
                    hoverDelayTimerRef.current = setTimeout(() => {
                        toggleMagnifierDOM(true);
                    }, 60);
                }
            } else {
                hideMagnifier();
                if (hoverDelayTimerRef.current) {
                    clearTimeout(hoverDelayTimerRef.current);
                    hoverDelayTimerRef.current = null;
                }
            }
            return;
        }

        if (e.pointerId !== activePointerIdRef.current) return;
        pointerCoordsRef.current = { x: e.clientX, y: e.clientY };

        if (magnifierActiveRef.current) {
            if (!isInsideVisibleRect(e.clientX, e.clientY)) {
                hideMagnifier();
            }
        }
    };

    const handlePointerUpImage = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') return;
        if (e.pointerId !== activePointerIdRef.current) return;
        if (magnifierActiveRef.current) {
            suppressClickRef.current = true;
            setTimeout(() => { suppressClickRef.current = false; }, 50);
        }
        hideMagnifier();
    };

    const handlePointerLeaveImage = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') {
            hideMagnifier();
            if (hoverDelayTimerRef.current) {
                clearTimeout(hoverDelayTimerRef.current);
                hoverDelayTimerRef.current = null;
            }
        } else if (e.pointerId === activePointerIdRef.current) {
            hideMagnifier();
        }
    };

    // ─── Regular Scroll Handling ───
    const handlePointerDownScroll = (e: React.PointerEvent) => {
        const el = scrollRef.current;
        if (!el) return;
        isDraggingRef.current = true;
        pauseAutoscroll();
        stopInertia();
        
        startYRef.current = e.clientY;
        initialScrollTopRef.current = el.scrollTop;
        el.setPointerCapture(e.pointerId);

        lastTimeRef.current = performance.now();
        lastPosRef.current = e.clientY;
        velocityRef.current = 0;
    };

    const handlePointerMoveScroll = (e: React.PointerEvent) => {
        if (!isDraggingRef.current || !scrollRef.current) return;
        const el = scrollRef.current;
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const dy = e.clientY - startYRef.current;
        const deltaPos = e.clientY - lastPosRef.current;

        velocityRef.current = deltaPos / dt;
        lastTimeRef.current = now;
        lastPosRef.current = e.clientY;

        el.scrollTop = initialScrollTopRef.current - dy;
    };

    const handlePointerUpScroll = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        if (Math.abs(velocityRef.current) > 0.1) {
            const friction = 0.95;
            let v = velocityRef.current;
            const maxV = 5;
            if (v > maxV) v = maxV;
            if (v < -maxV) v = -maxV;

            const step = () => {
                const el = scrollRef.current;
                if (!el) {
                    inertiaRafRef.current = null;
                    resumeAutoscroll();
                    return;
                }
                v *= friction;
                if (Math.abs(v) < 0.05) {
                    inertiaRafRef.current = null;
                    resumeAutoscroll();
                    return;
                }

                el.scrollTop -= v * 16;
                inertiaRafRef.current = requestAnimationFrame(step);
            };
            inertiaRafRef.current = requestAnimationFrame(step);
        } else {
            resumeAutoscroll();
        }
    };

    const copyUrl = item.src.replace(/\.(png|jpg|jpeg)$/i, (m) => "copy" + m);

    return (
        <div
            className="fixed inset-0 flex flex-col md:flex-row items-center justify-center p-[2vh] md:p-[3svh] pb-[max(2vh,env(safe-area-inset-bottom)+5px)] gap-[3vh] md:gap-[4svh] w-full h-full mx-auto max-w-[1600px] bg-black/70"
            style={{ zIndex: 9999, backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
            onClick={(e) => {
                if (!suppressClickRef.current) onClose();
            }}
        >
            {/* Close Button Top Right */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-[10000] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
                aria-label="Закрыть"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Magnifier Portal */}
            <div 
                ref={magnifierRef}
                className="fixed top-0 left-0 z-[100000] pointer-events-none rounded-full overflow-hidden border border-gray-400 shadow-2xl opacity-0 invisible"
                style={{ 
                    willChange: 'transform',
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            >
                <div 
                   ref={zoomedImageRef}
                   className="absolute top-0 left-0 pointer-events-none"
                   style={{
                       transformOrigin: 'top left',
                       willChange: 'transform',
                   }}
                >
                    <Image src={copyUrl} alt="" fill sizes="100vw" className="object-contain" unoptimized priority />
                </div>
            </div>

            {/* Square painting card */}
            <div
                ref={imageContainerRef}
                className="relative z-10 w-full aspect-square max-h-[65vh] md:aspect-square md:w-auto md:h-full md:max-h-none flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden"
                style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
                onClick={(e) => { e.stopPropagation(); }}
                onPointerDown={handlePointerDownImage}
                onPointerMove={handlePointerMoveImage}
                onPointerUp={handlePointerUpImage}
                onPointerCancel={handlePointerUpImage}
                onContextMenu={(e) => e.preventDefault()}
                onPointerLeave={handlePointerLeaveImage}
            >
                <Image
                    src={copyUrl}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 95vw, 85vh"
                    className="object-contain"
                    priority
                    draggable={false}
                    onLoad={handleImageLoad}
                />
            </div>

            {/* Text and Action Window */}
            <div
                className="relative z-10 w-full flex-1 md:flex-[1.2] lg:flex-1 h-full max-h-[40vh] md:max-h-none flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollable Content Container (Title, Body, Stats) */}
                <div 
                    ref={scrollRef}
                    onPointerDown={handlePointerDownScroll}
                    onPointerMove={handlePointerMoveScroll}
                    onPointerUp={handlePointerUpScroll}
                    onPointerCancel={handlePointerUpScroll}
                    onWheel={pauseAutoscroll}
                    onScroll={pauseAutoscroll}
                    className="w-full relative flex-1 flex flex-col font-comfortaa text-white/90 overflow-y-auto custom-scrollbar"
                    style={{ touchAction: "none", overscrollBehavior: "contain" }}
                >
                    <div className="shrink-0 p-5 pb-0 md:p-8 md:pb-0">
                        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-wide text-white drop-shadow-md">{item.title}</h2>
                    </div>

                    <div className="px-5 md:px-8 mt-2 flex flex-col gap-3">
                        {item.description.body.map((para, i) => (
                            <p key={i} className="font-light text-[15px] md:text-base lg:text-lg leading-relaxed text-balance">
                                {para}
                            </p>
                        ))}
                    </div>

                    <div className="shrink-0 pt-4 px-5 md:px-8">
                        <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-xl border border-white/10">
                            <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Архетип:</span> <span className="font-medium">{item.description.archetype}</span></p>
                            <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Энергия:</span> <span className="font-medium">{item.description.energy}</span></p>
                            <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Подходит тем кто:</span> {item.description.target}</p>
                            <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Атмосфера:</span> {item.description.atmosphere}</p>
                        </div>
                    </div>
                </div>

                {/* Fixed Action Area (Bottom) - Separated physically from the scroll container */}
                <div className="shrink-0 relative p-4 pt-2 pb-2">
                    {/* Social Order Popup Layer */}
                    <div className={`absolute bottom-[calc(100%+8px)] left-4 right-4 pointer-events-none transition-all duration-500 ease-out origin-bottom ${isOrderMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50" : "opacity-0 scale-[0.6] translate-y-10 z-[-1]"}`} style={{ height: "calc(max(20px, 5cqh) * 1.5)" }}>
                         <div className="relative w-full h-full">
                            <a href="http://t.me/jinnyji" target="_blank" rel="noreferrer"
                                className="absolute left-[25%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-full h-full scale-[0.9]"><Image src="/Telegram_logo.svg.png" alt="TG" fill className="object-contain" /></div>
                            </a>
                            <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                                className="absolute left-[50%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-full h-full scale-[0.8]"><Image src="/Instagram_icon.png" alt="IG" fill className="object-contain" /></div>
                            </a>
                            <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                                className="absolute left-[75%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-[110%] h-[110%]"><Image src="/vk-logo.png" alt="VK" fill className="object-contain" /></div>
                            </a>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
                        className={`w-full h-10 md:h-16 rounded-xl bg-gradient-to-r from-[#A01648]/90 to-[#CD2664]/90 border border-white/30 text-white font-comfortaa font-bold text-sm md:text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-xl tracking-wider`}
                    >
                        {isOrderMenuOpen ? 'НАПИШИ МНЕ' : 'ЗАБРОНИРОВАТЬ'}
                    </button>
                </div>

                <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.25);
                    border-radius: 10px;
                }
            `}</style>
            </div>
        </div>
    );
}
