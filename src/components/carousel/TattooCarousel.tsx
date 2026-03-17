"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";

const N = 9;
const SPEED = (2 * Math.PI) / (20 * 60); // 20 sec/rev at 60fps
const DRAG_SENSITIVITY = 0.0048; // Reduced from 0.008 (scaled ~0.6)

// ── Desktop ellipse fractions ──────────────────────────────────────────────
const CX_F = 0.50;
const CY_F = 0.47;
const AX_F = 0.42;
const AY_F = 0.28;
const MAX_SCALE = 1.0;
const MIN_SCALE = 0.28;

// ── Mobile ellipse fractions ───────────────────────────────────────────────
const M_CX_F = 0.50;
const M_CY_F = 0.63;
const M_AX_F = 0.45;
const M_AY_F = 0.20;
const M_MAX_SCALE = 1.0;
const M_MIN_SCALE = 0.20;

const IMGS = [
    '/tattoo/tattoo1.jpg', '/tattoo/tattoo2.jpg', '/tattoo/tattoo3.jpg',
    '/tattoo/tattoo4.jpg', '/tattoo/tattoo5.jpg', '/tattoo/tattoo6.jpg',
    '/tattoo/tattoo7.jpg', '/tattoo/tattoo8.jpg', '/tattoo/tattoo9.jpg',
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function TextContent({ mobile = false }: { mobile?: boolean }) {
    return (
        <div className={`flex flex-col text-white ${mobile
            ? 'gap-[5px] text-[12px] leading-tight'
            : 'gap-[6px] text-[13px] lg:text-[15px] leading-snug'
            }`}>
            <p className={`font-bold text-white/95 ${mobile ? 'text-[13px]' : 'text-[13px] lg:text-[14px] whitespace-nowrap'
                }`}>
                Индивидуальный эскиз татуировки по вашему запросу.
            </p>
            <div className={`flex flex-col ${mobile ? 'gap-[1px]' : 'gap-[2px]'}`}>
                <p className="font-semibold text-white/90">Процесс:</p>
                <ul className={`list-none flex flex-col pl-1 text-white/80 ${mobile ? 'gap-0' : 'gap-[2px]'}`}>
                    <li>— Обсуждение идеи и символики</li>
                    <li>— Создание эскиза</li>
                    <li>— Правки</li>
                    <li>— Финальный файл для мастера</li>
                </ul>
            </div>
            <div className="flex flex-col gap-[6px]">
                <p className="font-bold text-white/95">Стоимость: от 2 000 ₽</p>
                <p className={`text-white/75 italic ${mobile ? 'text-[11px]' : 'text-[11px] lg:text-[13px]'}`}>
                    Работаю в авторском стиле, с учётом анатомии и места нанесения.
                </p>
            </div>
        </div>
    );
}

export function TattooCarousel({ mobile = false }: { mobile?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textboxRef = useRef<HTMLDivElement>(null);
    const imgRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
    const angleRef = useRef(0);
    const pausedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const lastPointerXRef = useRef(0);
    const rafRef = useRef<number>(0);
    const halfWRef = useRef(100);
    const halfHRef = useRef(133);

    // Momentum refs
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(0);
    const inertiaRafRef = useRef<number | null>(null);

    // Hold-Preview refs
    const activePreviewIndexRef = useRef<number | null>(null);
    const isHoldingRef = useRef(false);
    const previewProgressRef = useRef(0);
    const maskWrapperRef = useRef<HTMLDivElement>(null);
    const previewImgRef = useRef<HTMLDivElement>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

    // Long-press refs
    const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pointerDownPosRef = useRef({ x: 0, y: 0 });
    const longPressArmedRef = useRef(false);
    const didMoveRef = useRef(false);

    const stopInertia = useCallback(() => {
        if (inertiaRafRef.current) {
            cancelAnimationFrame(inertiaRafRef.current);
            inertiaRafRef.current = null;
        }
    }, []);

    // Live textbox bounds (in px, relative to carousel container) for mask
    const [maskBounds, setMaskBounds] = useState({ l: 0, t: 0, w: 0, h: 0 });

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (activePreviewIndexRef.current !== null) return; // Ignore if already previewing
        isDraggingRef.current = true;
        pausedRef.current = true;
        stopInertia();
        lastPointerXRef.current = e.clientX;
        containerRef.current?.setPointerCapture(e.pointerId);

        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
    }, [stopInertia]);

    const handleItemPointerDown = (e: React.PointerEvent, index: number) => {
        // We DON'T stop propagation here so the container can still handle drag
        pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
        didMoveRef.current = false;
        longPressArmedRef.current = true;
        
        if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        
        longPressTimeoutRef.current = setTimeout(() => {
            if (!didMoveRef.current && longPressArmedRef.current) {
                activePreviewIndexRef.current = index;
                setPreviewSrc(IMGS[index]);
                isHoldingRef.current = true;
                pausedRef.current = true;
                stopInertia();
                longPressArmedRef.current = false; // Disarm once fired
            }
        }, 350);
    };

    const handleItemPointerUp = () => {
        longPressArmedRef.current = false;
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = null;
        }
        isHoldingRef.current = false;
    };

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        // If movement exceeds threshold, cancel long-press
        if (longPressArmedRef.current && !didMoveRef.current) {
            const dx_long = Math.abs(e.clientX - pointerDownPosRef.current.x);
            const dy_long = Math.abs(e.clientY - pointerDownPosRef.current.y);
            if (dx_long > 10 || dy_long > 10) {
                didMoveRef.current = true;
                longPressArmedRef.current = false;
                if (longPressTimeoutRef.current) {
                    clearTimeout(longPressTimeoutRef.current);
                    longPressTimeoutRef.current = null;
                }
            }
        }

        if (!isDraggingRef.current) return;
        
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const dx = e.clientX - lastPointerXRef.current;
        
        // Scale velocity by DRAG_SENSITIVITY as requested
        velocityRef.current = (dx * DRAG_SENSITIVITY) / dt;
        lastTimeRef.current = now;

        // Adjust angle: if dx > 0 (drag right), we want items to move right.
        // In the math: x = cx + ax * sin(θ). 
        // Increasing θ moves items in the direction of animation (SPEED is positive).
        // If dx > 0, we want to add to angle.
        angleRef.current += dx * DRAG_SENSITIVITY;
        lastPointerXRef.current = e.clientX;
    }, []);

    const stopDragging = useCallback((e: React.PointerEvent) => {
        // Always clean up long-press and holding state on release
        longPressArmedRef.current = false;
        isHoldingRef.current = false;
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = null;
        }

        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        containerRef.current?.releasePointerCapture(e.pointerId);

        // Don't restart orbit if we are in the middle of a preview
        if (activePreviewIndexRef.current !== null) return;

        // Start Inertia
        const threshold = 0.1 * DRAG_SENSITIVITY;
        if (Math.abs(velocityRef.current) > threshold) {
            const friction = 0.96; // Increased from 0.95
            let v = velocityRef.current;
            const maxV = 2.0 * DRAG_SENSITIVITY; // Reduced raw max from 3.0 to 2.0
            if (v > maxV) v = maxV;
            if (v < -maxV) v = -maxV;

            const step = () => {
                v *= friction;
                if (Math.abs(v) < threshold * 0.1) {
                    inertiaRafRef.current = null;
                    pausedRef.current = false;
                    return;
                }

                // Add v directly since it already includes sensitivity scaling
                angleRef.current += v * 16;
                inertiaRafRef.current = requestAnimationFrame(step);
            };
            inertiaRafRef.current = requestAnimationFrame(step);
        } else {
            pausedRef.current = false;
        }
    }, []);

    // ── Compute mask bounds whenever sizes change ───────────────────────────
    useLayoutEffect(() => {
        const tb = textboxRef.current;
        const con = containerRef.current;
        if (!tb || !con) return;

        const update = () => {
            const tbR = tb.getBoundingClientRect();
            const conR = con.getBoundingClientRect();
            setMaskBounds({
                l: tbR.left - conR.left,
                t: tbR.top - conR.top,
                w: tbR.width,
                h: tbR.height,
            });
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(tb);
        ro.observe(con);
        return () => ro.disconnect();
    }, [mobile]);

    // ── Animation loop ─────────────────────────────────────────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cx_f = mobile ? M_CX_F : CX_F;
        const cy_f = mobile ? M_CY_F : CY_F;
        const ax_f = mobile ? M_AX_F : AX_F;
        const ay_f = mobile ? M_AY_F : AY_F;
        const max_s = mobile ? M_MAX_SCALE : MAX_SCALE;
        const min_s = mobile ? M_MIN_SCALE : MIN_SCALE;
        const img_w_f = mobile ? 0.30 : 0.22;

        const step = () => {
            // Update preview progress
            if (isHoldingRef.current) {
                previewProgressRef.current = Math.min(1, previewProgressRef.current + 0.12);
            } else {
                previewProgressRef.current = Math.max(0, previewProgressRef.current - 0.12);
                if (previewProgressRef.current === 0 && activePreviewIndexRef.current !== null) {
                    activePreviewIndexRef.current = null;
                    setPreviewSrc(null); // Cleanup overlay
                    pausedRef.current = false;
                }
            }

            const p = previewProgressRef.current;
            const activeIdx = activePreviewIndexRef.current;

            if (!pausedRef.current && activeIdx === null) {
                angleRef.current += SPEED;
            }

            const W = container.offsetWidth;
            const H = container.offsetHeight;
            const cx = cx_f * W;
            const cy = cy_f * H;
            const ax = ax_f * W;
            const ay = ay_f * H;
            const hW = halfWRef.current;
            const hH = halfHRef.current;

            // Blur background layers (textbox and mask wrapper)
            const blurVal = p * 4;
            const opVal = 1 - p * 0.4;
            if (textboxRef.current) {
                textboxRef.current.style.filter = blurVal > 0 ? `blur(${blurVal}px)` : 'none';
                textboxRef.current.style.opacity = opVal.toString();
            }
            if (maskWrapperRef.current) {
                maskWrapperRef.current.style.filter = blurVal > 0 ? `blur(${blurVal}px)` : 'none';
            }

            imgRefs.current.forEach((el, i) => {
                if (!el) return;
                const θ = angleRef.current + (i / N) * 2 * Math.PI;
                const sinθ = Math.sin(θ);
                const cosθ = Math.cos(θ);
                const x = cx + ax * sinθ;
                const y = cy + ay * cosθ;
                const t = (1 + cosθ) / 2;

                const baseScale = lerp(min_s, max_s, t);
                const baseOpacity = lerp(0.4, 1.0, t);
                const zIndex = Math.round(t * 100);

                // If it's the active index, we animate it via the PREVIEW overlay
                // and hide the original one in the orbit.
                let finalOpacity = baseOpacity;
                
                if (activeIdx !== null && i === activeIdx) {
                    finalOpacity = baseOpacity * (1 - p);
                    
                    if (previewImgRef.current) {
                        const targetScale = baseScale * 2;
                        const targetX = cx - hW;
                        const targetY = cy - hH;
                        
                        const curX = x - hW;
                        const curY = y - hH;
                        
                        const finalX = lerp(curX, targetX, p);
                        const finalY = lerp(curY, targetY, p);
                        const finalScale = lerp(baseScale, targetScale, p);
                        
                        previewImgRef.current.style.transform = `translate(${finalX}px, ${finalY}px) scale(${finalScale})`;
                        previewImgRef.current.style.opacity = p.toString();
                    }
                }

                el.style.transform = `translate(${x - hW}px, ${y - hH}px) scale(${baseScale})`;
                el.style.opacity = finalOpacity.toString();
                el.style.zIndex = zIndex.toString();
                el.style.filter = 'none'; // Background blur handled on container level
            });

            rafRef.current = requestAnimationFrame(step);
        };

        // Delay one rAF so the container has settled layout before measuring
        rafRef.current = requestAnimationFrame(() => {
            const initW = container.offsetWidth;
            const baseW = Math.round(initW * img_w_f);
            const baseH = Math.round(baseW * 4 / 3);
            halfWRef.current = baseW / 2;
            halfHRef.current = baseH / 2;
            imgRefs.current.forEach(el => {
                if (!el) return;
                el.style.width = `${baseW}px`;
                el.style.height = `${baseH}px`;
            });
            rafRef.current = requestAnimationFrame(step);
        });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            stopInertia();
        };
    }, [mobile, stopInertia]);

    /*
     * Ellipse math:
     *   x(θ) = cx + ax·sin(θ)    [center at cx, right at θ=π/2]
     *   y(θ) = cy + ay·cos(θ)    [spotlight bottom at θ=0, back/top at θ=π]
     *   t = (1+cos(θ))/2         [0=back, 1=front]
     *
     * Text zone z-index = 50.
     * All image divs live inside a mask-wrapper which creates its own stacking
     * context (mask property) — so image z-indices never compete with the textbox.
     * The mask punches a hole in the wrapper at the textbox bounds so even the
     * background shines through cleanly.
     */

    // Textbox positioning
    // Mobile: width 58.5% (78%×0.75), centred, bottom at 43.5% from nav
    const textboxStyle: React.CSSProperties = mobile
        ? { bottom: '43.5%', left: '50%', transform: 'translateX(-50%)', width: '58.5%', zIndex: 50 }
        : { top: '5%', left: 'calc(27.5% + 5px)', width: 'calc(45% - 10px)', zIndex: 50 };

    // CSS mask: opaque everywhere EXCEPT the textbox rectangle (transparent there)
    const { l, t: mt, w: mw, h: mh } = maskBounds;
    const maskWrapperStyle: React.CSSProperties = mw > 0 ? {
        position: 'absolute',
        inset: 0,
        // Webkit (Safari / older Chrome)
        WebkitMaskImage: 'linear-gradient(#fff,#fff), linear-gradient(#fff,#fff)',
        WebkitMaskSize: `100% 100%, ${mw}px ${mh}px`,
        WebkitMaskPosition: `0 0, ${l}px ${mt}px`,
        WebkitMaskRepeat: 'no-repeat, no-repeat',
        WebkitMaskComposite: 'destination-out',
        // Standard
        maskImage: 'linear-gradient(#fff,#fff), linear-gradient(#fff,#fff)',
        maskSize: `100% 100%, ${mw}px ${mh}px`,
        maskPosition: `0 0, ${l}px ${mt}px`,
        maskRepeat: 'no-repeat, no-repeat',
        maskComposite: 'exclude',
    } : { position: 'absolute', inset: 0 };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={stopDragging}
        >
            {/* Text zone — always above the mask-wrapper stacking context */}
            <div
                ref={textboxRef}
                className="absolute bg-black/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-4 lg:p-5"
                style={textboxStyle}
            >
                <TextContent mobile={mobile} />
            </div>

            {/* Image wrapper — mask punches hole at textbox bounds */}
            <div ref={maskWrapperRef} style={maskWrapperStyle}>
                {IMGS.map((src, i) => (
                    <div
                        key={i}
                        ref={el => { imgRefs.current[i] = el; }}
                        onPointerDown={(e) => handleItemPointerDown(e, i)}
                        onPointerUp={handleItemPointerUp}
                        onPointerCancel={handleItemPointerUp}
                        className="absolute top-0 left-0 overflow-hidden rounded-xl shadow-2xl will-change-transform cursor-pointer"
                        style={{ transformOrigin: '50% 50%' }}
                    >
                        <Image
                            src={src}
                            alt={`Тату ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 55vw, 20vw"
                        />
                    </div>
                ))}
            </div>

            {/* Preview Layer — Above everything else, z-index 70 */}
            {previewSrc && (
                <div
                    ref={previewImgRef}
                    className="absolute top-0 left-0 pointer-events-none overflow-hidden rounded-xl shadow-2xl"
                    style={{ zIndex: 70, transformOrigin: '50% 50%', width: halfWRef.current * 2, height: halfHRef.current * 2 }}
                >
                    <Image src={previewSrc} alt="Preview" fill className="object-cover" />
                </div>
            )}
        </div>
    );
}
