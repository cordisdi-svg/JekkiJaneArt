"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { availablePics, PaintingData } from "@/data/availablePics";
import { ExpandedOverlay } from "./ExpandedOverlay";
import { useIsTouchDevice } from "@/lib/deviceDetect";
import { useHintCounter } from "@/lib/useHintCounter";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mod(n: number, m: number) { return ((n % m) + m) % m; }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

const VISIBLE_RANGE = 4;          // items each side of center
const POOL = 2 * VISIBLE_RANGE + 1; // 9 DOM elements
const DWELL_MS = 2500;
const EASE = 0.12;

function computeSlotStyle(distance: number, isMobile: boolean) {
    const t = clamp(Math.abs(distance), 0, 2);
    const scale = t <= 1 ? lerp(1, 0.9, t) : lerp(0.9, 0.8, t - 1);
    const blurFull = t <= 1 ? lerp(0, 1.5, t) : lerp(1.5, 3, t - 1);
    const blur = isMobile ? blurFull * 0.6 : blurFull;
    const brightness = t <= 1 ? lerp(1, 0.9, t) : lerp(0.9, 0.8, t - 1);
    return { scale, blur, brightness };
}

// Equalized visual gap spacing: pushes near cards slightly outwards (1.05x) to create a visual gap
// with the large center card, and compensates the far cards (0.95x) so they stay seamlessly in bounds.
function computeX(distance: number, step: number): number {
    const sign = Math.sign(distance);
    const d = Math.abs(distance);
    if (d <= 1) return sign * d * step * 1.05;
    return sign * (step * 1.05 + (d - 1) * step * 0.95);
}

// ─── Arrow ────────────────────────────────────────────────────────────────────
function ArrowBtn({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
    const isTouchDevice = useIsTouchDevice();
    return (
        <button type="button" onClick={onClick}
            aria-label={direction === "left" ? "Предыдущая" : "Следующая"}
            className="absolute top-0 z-30 flex h-full cursor-pointer items-center justify-center opacity-55 transition-opacity hover:opacity-90 active:scale-95"
            style={{ [direction]: 0, width: "36px" }}>
            <svg viewBox="0 0 12 34" className={isTouchDevice ? "h-14 w-5" : "h-20 w-6"} fill="rgba(255,255,255,0.92)" aria-hidden>
                {direction === "left" ? <path d="M11 1 1 17l10 16V1Z" /> : <path d="M1 1l10 16L1 33V1Z" />}
            </svg>
        </button>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function PaintingsCarousel() {
    const isTouchDevice = useIsTouchDevice();
    const items = availablePics;
    const n = items.length;

    // Hint counter — hide "жми" after 3 expand-to-view taps on mobile
    const { visible: expandHintVisible, increment: incrementExpandHint } = useHintCounter('paintings_expand');

    // React state — updated only at commit or UI toggles
    const [overlayItem, setOverlayItem] = useState<PaintingData>(items[0]);
    const [expanded, setExpanded] = useState(false);
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isIdle, setIsIdle] = useState(false);

    // Animation refs
    const posRef = useRef(0.0);
    const idxRef = useRef(0);
    const targetRef = useRef(0);
    const velocityRef = useRef(0.0);
    const isAnimRef = useRef(false);
    const queuedRef = useRef<1 | -1 | null>(null);
    const dwellRef = useRef<number | null>(null);
    const lastRoundRef = useRef(0);
    const baseIdxRef = useRef(0);

    // DOM refs
    const containerRef = useRef<HTMLDivElement>(null);
    const slotEls = useRef<(HTMLDivElement | null)[]>(Array(POOL).fill(null));
    const imgEls = useRef<(HTMLImageElement | null)[]>(Array(POOL).fill(null));
    const overlayDivRef = useRef<HTMLDivElement>(null);

    // Metric refs (computed on mount, no layout reads in rAF)
    const stepRef = useRef(320); // px between slot centers
    const centerWRef = useRef(220); // px width of center slot
    const centerHRef = useRef(320); // px height of center slot
    const isMobileRef = useRef(false);

    // Mirrors of state for rAF (avoid stale closure)
    const isPausedRef = useRef(false);
    const expandedRef = useRef(false);
    const orderMenuRef = useRef(false);
    const isIdleRef = useRef(false);

    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { expandedRef.current = expanded; }, [expanded]);
    useEffect(() => { orderMenuRef.current = isOrderMenuOpen; }, [isOrderMenuOpen]);

    // ── Measure container on mount / resize ───────────────────────────────────
    useEffect(() => {
        const measure = () => {
            const el = containerRef.current;
            if (!el) return;
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            const mob = isTouchDevice; // touch device always uses mobile card proportions
            isMobileRef.current = mob;
            if (mob) {
                const cw = w * 0.85;
                centerWRef.current = cw;
                centerHRef.current = cw * 16 / 11;
                // Боковая карточка сжимается до 90% (cw * 0.9). Плюс зазор 3% ширины экрана (w * 0.03).
                stepRef.current = (cw * 0.9) + (w * 0.03);
            } else {
                const cw = h * 11 / 16;
                centerWRef.current = cw;
                centerHRef.current = h;
                // near width + gap (matches original slot geometry)
                stepRef.current = h * 0.9 * 11 / 16 + w * 0.024;
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [isTouchDevice]);

    // ── Update img srcs for a given base index ────────────────────────────────
    const syncImgSrcs = (base: number) => {
        for (let i = 0; i < POOL; i++) {
            const globalIdx = base + (i - VISIBLE_RANGE);
            const item = items[mod(globalIdx, n)];
            const el = imgEls.current[i];
            if (el && el.dataset.src !== item.src) {
                el.src = item.src;
                el.alt = item.alt;
                el.dataset.src = item.src;
            }
        }
    };

    // ── rAF loop ──────────────────────────────────────────────────────────────
    useEffect(() => {
        let rafId: number;

        const commit = (ts: number) => {
            const newIdx = mod(Math.round(posRef.current), n);
            idxRef.current = newIdx;
            posRef.current = newIdx;
            targetRef.current = newIdx;
            isAnimRef.current = false;
            velocityRef.current = 0;
            dwellRef.current = ts;
            setOverlayItem(items[newIdx]);
            lastRoundRef.current = newIdx;
        };

        const loop = (ts: number) => {
            if (isAnimRef.current) {
                const diff = targetRef.current - posRef.current;
                posRef.current += diff * EASE;
                if (Math.abs(diff) < 0.001) {
                    commit(ts);
                    const q = queuedRef.current;
                    queuedRef.current = null;
                    if (q !== null) {
                        isAnimRef.current = true;
                        targetRef.current = Math.round(posRef.current) + q;
                        dwellRef.current = null;
                    }
                }
            } else {
                const snapTarget = Math.round(posRef.current);
                const toTarget = snapTarget - posRef.current;
                const hasVelocity = Math.abs(velocityRef.current) > 0.00001;
                const isOffCenter = Math.abs(toTarget) > 0.001;
                const isTouching = tStartX.current !== null;

                if (hasVelocity || (isOffCenter && !isTouching)) {
                    // Unified inertia + snap: no phase switch, one continuous curve
                    posRef.current += velocityRef.current + toTarget * 0.08;
                    velocityRef.current *= 0.92;
                    dwellRef.current = null;

                    // Commit when both close to slot and velocity settled
                    if (Math.abs(toTarget) < 0.001 && Math.abs(velocityRef.current) < 0.001) {
                        commit(ts);
                    }
                } else {
                    // Idle / dwell
                    if (!isPausedRef.current && !expandedRef.current && !orderMenuRef.current) {
                        if (dwellRef.current === null) dwellRef.current = ts;
                        else if (ts - dwellRef.current >= DWELL_MS) {
                            dwellRef.current = null;
                            isAnimRef.current = true;
                            // Target perfectly relative to current rounded position
                            targetRef.current = Math.round(posRef.current) + 1;
                            velocityRef.current = 0;
                        }
                    } else {
                        dwellRef.current = null;
                    }
                }
            }

            // Update img srcs when base changes
            const newBase = Math.floor(posRef.current);
            if (newBase !== baseIdxRef.current) {
                baseIdxRef.current = newBase;
                syncImgSrcs(newBase);
            }

            // Update rounded center for overlay buttons
            const rounded = Math.round(posRef.current);
            if (rounded !== lastRoundRef.current) {
                lastRoundRef.current = rounded;
                setOverlayItem(items[mod(rounded, n)]);
            }

            // Apply styles to each pool element
            const pos = posRef.current;
            const step = stepRef.current;
            const cw = centerWRef.current;
            const ch = centerHRef.current;
            const mob = isMobileRef.current;
            const base = baseIdxRef.current;

            for (let i = 0; i < POOL; i++) {
                const el = slotEls.current[i];
                if (!el) continue;
                const globalIdx = base + (i - VISIBLE_RANGE);
                const distance = globalIdx - pos;
                const x = computeX(distance, step);
                const { scale, blur, brightness } = computeSlotStyle(distance, mob);
                el.style.width = `${cw}px`;
                el.style.height = `${ch}px`;
                el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), -50%) scale(${scale.toFixed(4)})`;
                el.style.filter = `blur(${blur.toFixed(3)}px) brightness(${brightness.toFixed(4)})`;
                el.style.zIndex = String(Math.round(100 - Math.abs(distance) * 10));
                el.style.opacity = Math.abs(distance) > VISIBLE_RANGE - 0.5 ? "0" : "1";
            }

            // Center overlay — visible ONLY when fully idle (no anim, no velocity)
            if (overlayDivRef.current) {
                const idle = !isAnimRef.current && Math.abs(velocityRef.current) < 0.0001 && !expandedRef.current;
                overlayDivRef.current.style.opacity = idle ? "1" : "0";
                overlayDivRef.current.style.pointerEvents = idle ? "auto" : "none";
                // Asymmetric transition: slow appear, fast disappear
                overlayDivRef.current.style.transition = idle ? "opacity 0.4s ease" : "opacity 0.1s ease";
                overlayDivRef.current.style.width = `${cw}px`;
                overlayDivRef.current.style.height = `${ch}px`;

                if (idle !== isIdleRef.current) {
                    isIdleRef.current = idle;
                    setIsIdle(idle);
                }
            }

            rafId = requestAnimationFrame(loop);
        };

        syncImgSrcs(0);
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [n]);

    // ── Arrow nav ─────────────────────────────────────────────────────────────
    const arrowNav = (dir: 1 | -1) => {
        if (expandedRef.current) return;
        setIsOrderMenuOpen(false);
        dwellRef.current = null;
        if (isAnimRef.current) { queuedRef.current = dir; return; }
        velocityRef.current = 0;
        isAnimRef.current = true;
        targetRef.current = Math.round(posRef.current) + dir;
        queuedRef.current = null;
    };

    const stepExpanded = (dir: 1 | -1) => {
        const nextPos = Math.round(posRef.current) + dir;
        posRef.current = nextPos;
        velocityRef.current = 0;
        targetRef.current = nextPos;
        isAnimRef.current = false;
        
        let wrappedIdx = nextPos % items.length;
        if (wrappedIdx < 0) wrappedIdx += items.length;
        setOverlayItem(items[wrappedIdx]);
    };

    // ── Wheel ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: WheelEvent) => {
            e.preventDefault();
            if (isAnimRef.current) return;
            dwellRef.current = null;
            const raw = e.deltaY !== 0 ? e.deltaY : e.deltaX;
            const norm = clamp(raw, -40, 40);
            velocityRef.current = clamp(velocityRef.current + norm * 0.0015, -0.5, 0.5);
            posRef.current += norm * 0.002;
        };
        el.addEventListener("wheel", handler, { passive: false });
        return () => el.removeEventListener("wheel", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Pointer (Mouse & Touch) ───────────────────────────────────────────────
    const tStartX = useRef<number | null>(null);
    const tStartY = useRef<number | null>(null);
    const tLastX = useRef<number | null>(null);
    const tLastT = useRef<number | null>(null);
    const dragTotalRef = useRef<number>(0);
    const clickTargetRef = useRef<Element | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const target = e.target as Element;
        if (target.closest("button, a")) return;

        clickTargetRef.current = target;

        const el = e.currentTarget as HTMLElement;
        el.setPointerCapture(e.pointerId);

        tStartX.current = tLastX.current = e.clientX;
        tStartY.current = e.clientY;
        tLastT.current = Date.now();
        dragTotalRef.current = 0;
        dwellRef.current = null;
        setIsPaused(true);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (tLastX.current === null || tLastT.current === null) return;
        const now = Date.now();
        const dt = now - tLastT.current;
        if (dt > 0) {
            const dx = e.clientX - tLastX.current;
            velocityRef.current = clamp((dx / dt) * -0.08, -0.4, 0.4);
            posRef.current -= dx / stepRef.current;
            dragTotalRef.current += Math.abs(dx);
        }
        tLastX.current = e.clientX;
        tLastT.current = Date.now();
    };
    const onPointerUp = (e: React.PointerEvent) => {
        setIsPaused(false);
        const el = e.currentTarget as HTMLElement;
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

        if (tStartX.current === null || tStartY.current === null) return;
        const dx = e.clientX - tStartX.current;
        const dy = e.clientY - tStartY.current;
        tStartX.current = tStartY.current = null;
        tLastX.current = null;

        if (expanded) return;

        // Handle Swipe
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && Math.abs(velocityRef.current) < 0.02) {
            velocityRef.current = 0;
            arrowNav(dx < 0 ? 1 : -1);
        }
        // Handle Tap on Center
        else if (dragTotalRef.current < 5 && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            if (clickTargetRef.current?.closest("[data-expand-target]")) {
                incrementExpandHint();
                setExpanded(true);
            }
        }

        clickTargetRef.current = null;
    };

    return (
        <>
            {expanded && <ExpandedOverlay 
                item={overlayItem} 
                onClose={() => setExpanded(false)}
                onNext={() => stepExpanded(1)}
                onPrev={() => stepExpanded(-1)}
            />}

            <div
                ref={containerRef}
                className="relative flex h-full w-full select-none items-center justify-center overflow-hidden touch-pan-y"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ArrowBtn direction="left" onClick={() => arrowNav(-1)} />
                <ArrowBtn direction="right" onClick={() => arrowNav(1)} />

                {/* Infinite strip — pool of 9 absolutely-positioned items */}
                {Array.from({ length: POOL }, (_, i) => {
                    const offset = i - VISIBLE_RANGE;
                    const initItem = items[mod(offset, n)];
                    return (
                        <div
                            key={i}
                            ref={el => { slotEls.current[i] = el; }}
                            className="absolute overflow-hidden rounded-xl"
                            style={{ left: "50%", top: "50%", aspectRatio: "11/16" }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={el => { imgEls.current[i] = el; }}
                                src={initItem.src}
                                alt={initItem.alt}
                                data-src={initItem.src}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                draggable={false}
                            />
                        </div>
                    );
                })}

                {/* Center overlay — buttons layer, always at center */}
                <div
                    ref={overlayDivRef}
                    className="absolute pointer-events-none"
                    style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", aspectRatio: "11/16", zIndex: 200 }}
                >
                    {/* Click-to-expand hit area */}
                    <div
                        data-expand-target="true"
                        className="absolute inset-0 cursor-pointer pointer-events-auto"
                        title="Открыть подробнее"
                    />

                    {/* Social buttons */}
                    <div
                        className={`pointer-events-none absolute flex flex-col-reverse items-center transition-all duration-500 ease-out origin-bottom-left ${isOrderMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50" : "opacity-0 scale-50 translate-y-8 z-[-1]"}`}
                        style={{ bottom: "calc(7.25% + max(8px, 2.5%))", left: "2.5%", gap: "max(8px, 2.5%)" }}
                    >
                        {[
                            { href: "http://t.me/jinnyji", src: "/Telegram_logo.svg.webp", alt: "TG", size: "90%" },
                            { href: "https://www.instagram.com/jekki.jane.art/", src: "/Instagram_icon.webp", alt: "IG", size: "80%" },
                            { href: "https://vk.ru/id437361077", src: "/vk-logo.webp", alt: "VK", size: "110%" },
                        ].map(({ href, src, alt, size }) => (
                            <a key={alt} href={href} target="_blank" rel="noreferrer"
                                className="pointer-events-auto aspect-square rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                style={{ height: "9cqh" }}
                                onClick={e => e.stopPropagation()}>
                                <div className="absolute inset-0 bg-transparent mix-blend-screen pointer-events-none" />
                                <div style={{ position: "relative", width: size, height: size }}>
                                    <Image src={src} alt={alt} fill className="object-contain"  unoptimized />
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div
                        className="pointer-events-none absolute flex gap-2"
                        style={{ bottom: "1.25%", height: "6%", left: "2.5%", right: "2.5%" }}
                    >
                        {/* Mobile Click Hint ("жми") - sync with idle state inherited from parent div opacity */}
                        {isIdle && (
                            <div 
                                key={isIdle ? "active" : "inactive"}
                                className="hide-on-desktop absolute left-[83.3%] top-[-160%] -translate-x-1/2 -translate-y-[35px] pointer-events-none flex items-center justify-center w-[85px] h-[85px]"
                                style={{ opacity: 0.45, visibility: expandHintVisible ? 'visible' : 'hidden' }}
                            >
                                <span 
                                    className="absolute z-20 font-comfortaa-bold uppercase tracking-[0.2em] mobile-hint-text-immediate"
                                    style={{ 
                                        fontSize: "11px", 
                                        color: "#C2185B", 
                                        textShadow: "0 1px 4px rgba(255,255,255,0.4)" 
                                    }}
                                >
                                    жми
                                </span>
                                <svg viewBox="0 0 100 100" width="100%" height="100%" className="absolute inset-0">
                                    {[16, 21, 26, 31, 36].map((r, i) => (
                                        <circle
                                            key={i}
                                            cx="50" cy="50" r={r}
                                            stroke="#F48FB1"
                                            strokeWidth={i % 2 === 0 ? "3.5" : "1.5"}
                                            fill="none"
                                            className="mobile-hint-wave-immediate"
                                            style={{ animationDelay: `${i * 0.12}s` }}
                                        />
                                    ))}
                                </svg>
                            </div>
                        )}

                        <button type="button"
                            onClick={e => { e.stopPropagation(); setIsOrderMenuOpen(v => !v); dwellRef.current = null; }}
                            className="pointer-events-auto flex-[2] rounded-xl border border-[#C2185B]/55 bg-white/82 text-[11px] sm:text-[12px] md:text-sm lg:text-[14.5px] font-comfortaa font-bold text-[#C2185B] shadow-lg transition-all hover:bg-white active:scale-[0.98] tracking-widest leading-none flex items-center justify-center"
                        >
                            {isOrderMenuOpen ? "НАПИШИ МНЕ" : "ЗАБРОНИРОВАТЬ"}
                        </button>
                        <button type="button"
                            onClick={e => { e.stopPropagation(); setExpanded(true); dwellRef.current = null; }}
                            className="pointer-events-auto flex-[1] rounded-xl border border-[#C2185B]/55 bg-white/82 text-[11px] sm:text-[12px] md:text-sm lg:text-[14px] font-comfortaa font-bold text-[#C2185B] shadow-lg transition-all hover:bg-white active:scale-[0.98] tracking-wide leading-none flex items-center justify-center"
                        >
                            О КАРТИНЕ
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
