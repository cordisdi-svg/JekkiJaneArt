"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PaintingData } from "@/data/availablePics";

// ─── Expanded overlay (covers full viewport including nav) ────────────────────
export function ExpandedOverlay({ 
    item, 
    onClose,
    onNext,
    onPrev
}: { 
    item: PaintingData; 
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}) {
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
    const [showPinchHint, setShowPinchHint] = useState(false);

    // Hint animation refs
    const hintTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hintAnimTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasPinchedRef = useRef(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const autoscrollPausedRef = useRef(true);
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

    // Stable touch-device flag (pointer: coarse). useRef so it's read in rAF/callbacks
    // without stale closures, and is safe on hybrid devices (evaluated once at mount).
    const isTouchDeviceRef = useRef(false);

    const visibleRectRef = useRef<{ left: number, top: number, width: number, height: number, intrinsicWidth: number, intrinsicHeight: number } | null>(null);
    const magnifierActiveRef = useRef(false);
    const activePointerIdRef = useRef<number | null>(null);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hoverDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const suppressClickRef = useRef(false);
    const pointerCoordsRef = useRef({ x: 0, y: 0 });
    const rafTrackingRef = useRef<number | null>(null);
    // Pending rAF id for geometry recalc (deduplicated)
    const geoRafRef = useRef<number | null>(null);

    // Edge-flip and dynamic zoom
    const targetZoomRef = useRef(2);
    const currentZoomRef = useRef(2);
    const targetOffsetXRef = useRef(0);
    const currentOffsetXRef = useRef(0);
    const targetOffsetYRef = useRef(0);
    const currentOffsetYRef = useRef(0);
    const secondaryPointerRef = useRef<{ id: number, startX: number, startY: number } | null>(null);
    const primaryPointerStartDistRef = useRef<number>(0);

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
        }, 7000);
    }, []);

    useEffect(() => {
        // Evaluate touch capability once at mount (stable for the lifetime of the overlay)
        isTouchDeviceRef.current = window.matchMedia('(pointer: coarse)').matches;

        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", h);
        document.body.classList.add("overlay-open");

        // Autoscroll logic (start paused, will resume after 7s via timeout)
        autoscrollPausedRef.current = true;
        resumeAutoscroll();

        const scrollStep = () => {
            const el = scrollRef.current;
            if (el && !autoscrollPausedRef.current && !isDraggingRef.current && !inertiaRafRef.current) {
                // Пытаемся скроллить. Если el.scrollHeight > el.clientHeight, скролл возможен.
                el.scrollTop += 0.4;
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

    // scheduleGeometry: deduplicated rAF wrapper so we always read layout
    // one frame after the browser has finished reflow (avoids resize race-conditions).
    const scheduleGeometry = useCallback(() => {
        if (geoRafRef.current !== null) return; // already scheduled
        geoRafRef.current = requestAnimationFrame(() => {
            geoRafRef.current = null;
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
            const renderTop  = containerRect.top  + (containerRect.height - renderHeight) / 2;

            visibleRectRef.current = {
                left: renderLeft,
                top: renderTop,
                width: renderWidth,
                height: renderHeight,
                intrinsicWidth,
                intrinsicHeight
            };

            if (zoomedImageRef.current) {
                zoomedImageRef.current.style.width  = `${renderWidth}px`;
                zoomedImageRef.current.style.height = `${renderHeight}px`;
            }

            // After geometry is fresh, guarantee autoscroll is running on touch.
            // This is safe to call redundantly — it checks isTouchDeviceRef internally.
            resumeAutoscroll();
        });
    }, [resumeAutoscroll]);

    useEffect(() => {
        // ResizeObserver on the image container — fires on element size changes.
        const resizeObserver = new ResizeObserver(() => scheduleGeometry());
        if (imageContainerRef.current) {
            resizeObserver.observe(imageContainerRef.current);
        }
        // window resize covers viewport changes (including device rotation,
        // which also fires resize). orientationchange is NOT needed — it fires
        // before layout settles, causing stale getBoundingClientRect reads.
        window.addEventListener('resize', scheduleGeometry);
        return () => {
            resizeObserver.disconnect();
            if (geoRafRef.current !== null) {
                cancelAnimationFrame(geoRafRef.current);
                geoRafRef.current = null;
            }
            window.removeEventListener('resize', scheduleGeometry);
            hideMagnifier();
        };
    }, [scheduleGeometry]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        visibleRectRef.current = {
            left: 0, top: 0, width: 0, height: 0,
            intrinsicWidth: target.naturalWidth,
            intrinsicHeight: target.naturalHeight
        };
        scheduleGeometry();
    };

    const updateMagnifierDOM = () => {
        if (!magnifierRef.current || !zoomedImageRef.current || !visibleRectRef.current) return;
        const rect = visibleRectRef.current;
        const { x, y } = pointerCoordsRef.current;

        const clampedX = Math.max(rect.left, Math.min(x, rect.left + rect.width));
        const clampedY = Math.max(rect.top, Math.min(y, rect.top + rect.height));

        const isTouch = isTouchDeviceRef.current;
        // magSize: desktop uses 300px lens; touch uses ~60% of the shorter viewport edge
        // clamped to [160, 220] so it scales with screen but stays usable on tiny phones.
        const magSize = isTouch
            ? Math.min(220, Math.max(160, Math.min(window.innerWidth, window.innerHeight) * 0.38))
            : 300;

        // baseOffsetY: on touch the lens floats above the finger.
        // We anchor it so its bottom edge clears the finger with ~10px gap.
        // No baseOffsetX — no coordinate swap, no X inversion.
        const baseOffsetX = 0;
        const baseOffsetY = isTouch ? -(magSize / 2 + 10) : 0;

        // Edge-flip thresholds — calculated against the native pointer position,
        // not the offset position, to prevent oscillation.
        const nativeCenterX = x + baseOffsetX; // baseOffsetX=0, explicit for clarity
        const nativeCenterY = y + baseOffsetY;
        const boundaryThreshold = magSize / 2;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // X Flip
        if (nativeCenterX < 0) {
            targetOffsetXRef.current = magSize / 2 + 10;
        } else if (nativeCenterX > vw) {
            targetOffsetXRef.current = -(magSize / 2 + 10);
        } else if (nativeCenterX > boundaryThreshold + 20 && nativeCenterX < vw - boundaryThreshold - 20) {
            targetOffsetXRef.current = baseOffsetX; // safe zone — return to natural
        }

        // Y Flip
        if (nativeCenterY < 0) {
            targetOffsetYRef.current = magSize / 2 + 10;
        } else if (nativeCenterY > vh) {
            targetOffsetYRef.current = -(magSize / 2 + 10);
        } else if (nativeCenterY > boundaryThreshold + 20 && nativeCenterY < vh - boundaryThreshold - 20) {
            targetOffsetYRef.current = baseOffsetY; // safe zone — return to natural
        }

        // Smooth interpolation (runs every rAF frame)
        currentZoomRef.current   += (targetZoomRef.current   - currentZoomRef.current)   * 0.15;
        currentOffsetXRef.current += (targetOffsetXRef.current - currentOffsetXRef.current) * 0.15;
        currentOffsetYRef.current += (targetOffsetYRef.current - currentOffsetYRef.current) * 0.15;

        const zoom = currentZoomRef.current;

        const magX = clampedX - magSize / 2 + currentOffsetXRef.current;
        const magY = clampedY - magSize / 2 + currentOffsetYRef.current;

        magnifierRef.current.style.transform = `translate3d(${magX}px, ${magY}px, 0)`;
        magnifierRef.current.style.width  = `${magSize}px`;
        magnifierRef.current.style.height = `${magSize}px`;

        // Relative position inside the visible image (clientX/Y — no coordinate swap).
        const relX = clampedX - rect.left;
        const relY = clampedY - rect.top;

        const zoomedX = relX * zoom;
        const zoomedY = relY * zoom;

        // Translate so the sampled point stays centered in the lens.
        const transX = (magSize / 2) - zoomedX - currentOffsetXRef.current;
        const transY = (magSize / 2) - zoomedY - currentOffsetYRef.current;

        // Clamp so we never show empty space beyond image edges.
        const maxTransX = 0;
        const minTransX = magSize - (rect.width * zoom);
        const finalTransX = minTransX > maxTransX
            ? (magSize - rect.width  * zoom) / 2
            : Math.max(minTransX, Math.min(maxTransX, transX));

        const maxTransY = 0;
        const minTransY = magSize - (rect.height * zoom);
        const finalTransY = minTransY > maxTransY
            ? (magSize - rect.height * zoom) / 2
            : Math.max(minTransY, Math.min(maxTransY, transY));

        zoomedImageRef.current.style.transform = `translate3d(${finalTransX}px, ${finalTransY}px, 0) scale(${zoom})`;
    };

    const toggleMagnifierDOM = (visible: boolean) => {
        if (!magnifierRef.current) return;
        magnifierActiveRef.current = visible;
        if (visible) {
            const isTouch = isTouchDeviceRef.current;
            // Derive initial magSize the same way updateMagnifierDOM does,
            // so offsets are coherent from the first frame.
            const magSize = isTouch
                ? Math.min(220, Math.max(160, Math.min(window.innerWidth, window.innerHeight) * 0.38))
                : 300;

            targetZoomRef.current = 2;
            currentZoomRef.current = 2;
            // No X offset — no coordinate swap.
            targetOffsetXRef.current  = 0;
            currentOffsetXRef.current = 0;
            // Y offset: lens floats above finger on touch, centered on cursor on desktop.
            targetOffsetYRef.current  = isTouch ? -(magSize / 2 + 10) : 0;
            currentOffsetYRef.current = targetOffsetYRef.current;

            magnifierRef.current.style.opacity = '1';
            magnifierRef.current.style.visibility = 'visible';

            // Pinch to zoom hint trigger logic
            hasPinchedRef.current = false;
            setShowPinchHint(false);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            if (hintAnimTimerRef.current) clearTimeout(hintAnimTimerRef.current);
            if (isTouch) {
                hintTimerRef.current = setTimeout(() => {
                    if (!hasPinchedRef.current && magnifierActiveRef.current) {
                        setShowPinchHint(true);
                        hintAnimTimerRef.current = setTimeout(() => setShowPinchHint(false), 3000);
                    }
                }, 2500);
            }

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
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            if (hintAnimTimerRef.current) clearTimeout(hintAnimTimerRef.current);
            setShowPinchHint(false);
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
            try { imageContainerRef.current.releasePointerCapture(activePointerIdRef.current); } catch (e) { }
            activePointerIdRef.current = null;
        }
    };

    const handlePointerDownImage = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') {
            targetZoomRef.current = 3;
            return;
        }

        // Mobile dual-touch handling
        if (activePointerIdRef.current !== null) {
            if (magnifierActiveRef.current && !secondaryPointerRef.current && e.pointerId !== activePointerIdRef.current) {
                secondaryPointerRef.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY };
                primaryPointerStartDistRef.current = Math.hypot(e.clientX - pointerCoordsRef.current.x, e.clientY - pointerCoordsRef.current.y);
                try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { }
            }
            return;
        }

        if (!e.isPrimary) return;
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

        // Secondary mobile touch handling
        if (secondaryPointerRef.current && e.pointerId === secondaryPointerRef.current.id) {
            if (!hasPinchedRef.current) {
                hasPinchedRef.current = true;
                setShowPinchHint(false);
                if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
                if (hintAnimTimerRef.current) clearTimeout(hintAnimTimerRef.current);
            }

            const currentDist = Math.hypot(e.clientX - pointerCoordsRef.current.x, e.clientY - pointerCoordsRef.current.y);
            if (primaryPointerStartDistRef.current > 0) {
                const ratio = currentDist / primaryPointerStartDistRef.current;
                targetZoomRef.current = Math.max(2, Math.min(3, 2 * ratio));
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
        if (e.pointerType === 'mouse') {
            targetZoomRef.current = 2;
            return;
        }
        if (secondaryPointerRef.current && e.pointerId === secondaryPointerRef.current.id) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { }
            secondaryPointerRef.current = null;
            targetZoomRef.current = 2; // Ease back smoothly
            return;
        }
        if (e.pointerId !== activePointerIdRef.current) return;
        if (magnifierActiveRef.current) {
            suppressClickRef.current = true;
            setTimeout(() => { suppressClickRef.current = false; }, 50);
        }
        hideMagnifier();
    };

    const handlePointerLeaveImage = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') {
            targetZoomRef.current = 2;
            hideMagnifier();
            if (hoverDelayTimerRef.current) {
                clearTimeout(hoverDelayTimerRef.current);
                hoverDelayTimerRef.current = null;
            }
        } else if (secondaryPointerRef.current && e.pointerId === secondaryPointerRef.current.id) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { }
            secondaryPointerRef.current = null;
            targetZoomRef.current = 2;
            return;
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

    const swipeStartXRef = useRef<number | null>(null);
    const swipeStartYRef = useRef<number | null>(null);
    const wasSwipeRef = useRef(false);

    const handleContainerPointerDown = (e: React.PointerEvent) => {
        // Swipe-to-navigate is a touch-only interaction
        if (!e.isPrimary || !isTouchDeviceRef.current) return;
        if (magnifierActiveRef.current) return;
        swipeStartXRef.current = e.clientX;
        swipeStartYRef.current = e.clientY;
        wasSwipeRef.current = false;
    };

    const handleContainerPointerMove = (e: React.PointerEvent) => {
        // Cancel swipe if secondary pointer (pinch) or magnifier activates
        if (!e.isPrimary || magnifierActiveRef.current) {
            swipeStartXRef.current = null;
            return;
        }
        if (swipeStartXRef.current === null || swipeStartYRef.current === null) return;
        const dx = e.clientX - swipeStartXRef.current;
        const dy = e.clientY - swipeStartYRef.current;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            wasSwipeRef.current = true;
        }
    };

    const handleContainerPointerUp = (e: React.PointerEvent) => {
        if (!e.isPrimary || swipeStartXRef.current === null || swipeStartYRef.current === null) return;
        
        if (magnifierActiveRef.current) {
            swipeStartXRef.current = null;
            swipeStartYRef.current = null;
            return;
        }

        const dx = e.clientX - swipeStartXRef.current;
        const dy = e.clientY - swipeStartYRef.current;
        swipeStartXRef.current = null;
        swipeStartYRef.current = null;

        // Increased swipe threshold from 100 to 150 for a more decisive swipe
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 150) {
            if (dx > 0 && onPrev) onPrev();
            else if (dx < 0 && onNext) onNext();
        }
    };

    const copyUrl = item.src.replace(/\.(png|jpg|jpeg|webp)$/i, (m) => "copy" + m);

    return (
        <div
            className="fixed inset-0 flex flex-col md:flex-row items-center justify-center p-[2vh] md:p-[3svh] pb-[max(2vh,env(safe-area-inset-bottom)+5px)] gap-[3vh] md:gap-[4svh] w-full h-full mx-auto max-w-[1600px] bg-black/70"
            style={{ zIndex: 9999, backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
            onPointerDown={handleContainerPointerDown}
            onPointerMove={handleContainerPointerMove}
            onPointerUp={handleContainerPointerUp}
            onPointerCancel={handleContainerPointerUp}
            onClick={(e) => {
                if (!suppressClickRef.current && !wasSwipeRef.current && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Close Button Top Right */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-2 md:right-4 z-[10000] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
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
                className="fixed top-0 left-0 z-[100000] pointer-events-none shadow-2xl opacity-0 invisible rounded-full"
                style={{
                    willChange: 'transform',
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            >
                {/* Inner bounds container replacing the outer class limitations */}
                <div className="absolute inset-0 rounded-full overflow-hidden border border-gray-400">
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

                {/* Mobile pinch hint layered directly inside magnifier to exit its edges cleanly */}
                {showPinchHint && (
                    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                        <div className="absolute left-[5%] top-1/2 text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pinch-hint-left">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </div>
                        <div className="absolute right-[5%] top-1/2 text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pinch-hint-right">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </div>
                    </div>
                )}
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
                    unoptimized
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
                    onWheel={() => { pauseAutoscroll(); resumeAutoscroll(); }}
                    className="w-full relative flex-1 flex flex-col font-comfortaa text-white/90 overflow-y-auto custom-scrollbar"
                    style={{ touchAction: "none", overscrollBehavior: "contain" }}
                >
                    <div className="shrink-0 order-1 p-5 pb-0 md:p-8 md:pb-2">
                        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-wide text-white drop-shadow-md">{item.title}</h2>
                    </div>

                    {/* Характеристики (мобила: сверху плоско, десктоп: снизу в боксе) */}
                    <div className="shrink-0 order-2 md:order-3 mt-2 md:mt-6 mb-2 md:mb-8 mx-0 md:mx-8 px-5 md:px-6 py-0 md:py-5 md:bg-black/20 md:backdrop-blur-sm md:rounded-2xl md:border md:border-white/10 md:shadow-inner flex flex-col gap-1.5 opacity-90 xl:mb-12">
                        <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Архетип:</span> <span className="font-medium">{item.description.archetype}</span></p>
                        <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Энергия:</span> <span className="font-medium">{item.description.energy}</span></p>
                        <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Подходит тем кто:</span> {item.description.target}</p>
                        <p className="font-light text-[14px] md:text-[15px]"><span className="font-bold text-[#E91E63]">Атмосфера:</span> {item.description.atmosphere}</p>
                    </div>

                    {/* Текстовое описание */}
                    <div className="order-3 md:order-2 px-5 md:px-8 mt-4 md:mt-2 flex flex-col gap-3 pb-6 md:pb-0">
                        {item.description.body.map((para, i) => (
                            <p key={i} className="font-light text-[15px] md:text-base lg:text-[17px] leading-relaxed text-balance">
                                {para}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Fixed Action Area (Bottom) - Separated physically from the scroll container */}
                <div className="shrink-0 relative p-4 pt-2 pb-2">
                    {/* Social Order Popup Layer */}
                    <div className={`social-popup-size absolute bottom-[calc(100%+8px)] left-4 right-4 pointer-events-none transition-all duration-500 ease-out origin-bottom ${isOrderMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50" : "opacity-0 scale-[0.6] translate-y-10 z-[-1]"}`}>
                        <div className="relative w-full h-full">
                            <a href="http://t.me/jinnyji" target="_blank" rel="noreferrer"
                                className="absolute left-[25%] md:left-[19%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-full h-full scale-[0.9]"><Image src="/Telegram_logo.svg.webp" alt="TG" fill className="object-contain"  unoptimized /></div>
                            </a>
                            <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                                className="absolute left-[50%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-full h-full scale-[0.8]"><Image src="/Instagram_icon.webp" alt="IG" fill className="object-contain"  unoptimized /></div>
                            </a>
                            <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                                className="absolute left-[75%] md:left-[81%] -translate-x-1/2 pointer-events-auto aspect-square h-full rounded-full border border-white/40 drop-shadow-lg shadow-black/50 overflow-hidden hover:scale-105 active:scale-95 transition-transform bg-white/10 backdrop-blur-md flex items-center justify-center mix-blend-screen"
                            >
                                <div className="relative w-[110%] h-[110%]"><Image src="/vk-logo.webp" alt="VK" fill className="object-contain"  unoptimized /></div>
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
                .social-popup-size {
                    height: calc(max(20px, 5cqh) * 1.5);
                }
                @media (pointer: fine) {
                    .social-popup-size {
                        height: calc(max(20px, 5cqh) * 3);
                    }
                }
                .pinch-hint-left {
                    animation: pinchHintLeftAnim 1.8s ease-in-out forwards;
                }
                .pinch-hint-right {
                    animation: pinchHintRightAnim 1.8s ease-in-out forwards;
                }
                @keyframes pinchHintLeftAnim {
                    0% { opacity: 0; transform: translateY(-50%) translateX(0); }
                    20% { opacity: 0.9; transform: translateY(-50%) translateX(0); }
                    80% { opacity: 0.9; transform: translateY(-50%) translateX(-25px); }
                    100% { opacity: 0; transform: translateY(-50%) translateX(-25px); }
                }
                @keyframes pinchHintRightAnim {
                    0% { opacity: 0; transform: translateY(-50%) translateX(0); }
                    20% { opacity: 0.9; transform: translateY(-50%) translateX(0); }
                    80% { opacity: 0.9; transform: translateY(-50%) translateX(25px); }
                    100% { opacity: 0; transform: translateY(-50%) translateX(25px); }
                }

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
