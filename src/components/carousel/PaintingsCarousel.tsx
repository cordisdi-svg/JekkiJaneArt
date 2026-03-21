"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { availablePics, PaintingData } from "@/data/availablePics";
import { ExpandedOverlay } from "./ExpandedOverlay";

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

// ─── Arrow button ─────────────────────────────────────────────────────────────
function ArrowBtn({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={direction === "left" ? "Предыдущая" : "Следующая"}
            className="absolute top-0 z-30 flex h-full cursor-pointer items-center justify-center opacity-55 transition-opacity hover:opacity-90 active:scale-95"
            style={{ [direction]: 0, width: "36px" }}
        >
            <svg viewBox="0 0 12 34" className="h-14 w-5 md:h-20 md:w-6" fill="rgba(255,255,255,0.92)" aria-hidden>
                {direction === "left"
                    ? <path d="M11 1 1 17l10 16V1Z" />
                    : <path d="M1 1l10 16L1 33V1Z" />}
            </svg>
        </button>
    );
}

// ─── Carousel slot wrappers ───────────────────────────────────────────────────
function FarSlot({ item, fadeDir }: { item: PaintingData; fadeDir: "left" | "right" }) {
    const maskVal = `linear-gradient(to ${fadeDir}, rgba(0,0,0,0.85) 0%, transparent 100%)`;
    // Mobile hidden, Desktop 25.92% width (90% of Near)
    return (
        <div
            className="relative hidden md:block flex-shrink-0 transition-transform duration-500 ease-out"
            style={{ maskImage: maskVal, WebkitMaskImage: maskVal, aspectRatio: "11/16", filter: "brightness(0.8) blur(3px)", height: "81%" }}
        >
            <Image src={item.src} alt={item.alt} fill sizes="26vw" className="object-cover" />
        </div>
    );
}

function NearSlot({ item, fadeDirMobile }: { item: PaintingData; fadeDirMobile: "left" | "right" }) {
    const maskValMobile = `linear-gradient(to ${fadeDirMobile}, rgba(0,0,0,0.85) 0%, transparent 100%)`;
    // Mobile 67.5% width (90% of Center), fading. Desktop 28.8% width (90% of Center), no fade.
    return (
        <>
            {/* Mobile rendering for Near slots (acts as far) */}
            <div className="relative md:hidden flex-shrink-0 w-[67.5%] transition-transform duration-500 ease-out" style={{ maskImage: maskValMobile, WebkitMaskImage: maskValMobile, aspectRatio: "11/16", filter: "brightness(0.85) blur(2px)" }}>
                <Image src={item.src} alt={item.alt} fill sizes="68vw" className="object-cover" />
            </div>
            {/* Desktop rendering for Near slots (no fade) using height-based scaling to 90% */}
            <div className="relative hidden md:block flex-shrink-0 transition-transform duration-500 ease-out" style={{ height: "90%", aspectRatio: "11/16", filter: "brightness(0.9) blur(1.5px)" }}>
                <Image src={item.src} alt={item.alt} fill sizes="29vw" className="object-cover" />
            </div>
        </>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function PaintingsCarousel() {
    const items = availablePics;
    const n = items.length;
    const [idx, setIdx] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);

    // Auto timer logic
    const [timerTick, setTimerTick] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const throttled = useRef(false);

    // Increment index and close order menu
    const navigate = useCallback((dir: 1 | -1) => {
        if (expanded) return;
        setIdx((i) => mod(i + dir, n));
        setIsOrderMenuOpen(false);
    }, [n, expanded]);

    const next = useCallback(() => navigate(1), [navigate]);
    const prev = useCallback(() => navigate(-1), [navigate]);

    // Timer Interval logic (5 seconds loop)
    useEffect(() => {
        if (isPaused || expanded || isOrderMenuOpen) return;
        const interval = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, expanded, isOrderMenuOpen, next, timerTick]);

    // Triggered on any manual scroll action to reset the 5s clock
    const resetTimer = useCallback(() => {
        setTimerTick(t => t + 1);
    }, []);

    // Non-passive wheel to prevent page scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: WheelEvent) => {
            e.preventDefault();
            if (throttled.current) return;
            throttled.current = true;
            resetTimer(); // Reset auto timer
            setTimeout(() => (throttled.current = false), 420);
            if (e.deltaY > 0 || e.deltaX > 0) next(); else prev();
        };
        el.addEventListener("wheel", handler, { passive: false });
        return () => el.removeEventListener("wheel", handler);
    }, [next, prev, resetTimer]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        setIsPaused(true); // Pause while holding touch
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        setIsPaused(false); // Resume after release
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null; touchStartY.current = null;
        if (expanded) return;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            resetTimer();
            if (dx < 0) next();
            else prev();
        }
    };

    const at = (o: number) => items[mod(idx + o, n)];

    return (
        <>
            {expanded && <ExpandedOverlay item={at(0)} onClose={() => setExpanded(false)} />}

            {/* 
        Use absolute inset so the carousel doesn't create any overflow.
        The parent in page.tsx gives this div a defined height via flex-1.
      */}
            <div
                ref={containerRef}
                className="relative flex h-full w-full select-none items-center justify-center overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ArrowBtn direction="left" onClick={() => { resetTimer(); prev(); }} />
                <ArrowBtn direction="right" onClick={() => { resetTimer(); next(); }} />

                {/* Track: slots centered with responsive uniform gaps */}
                <div className="flex h-full w-full items-center justify-center gap-[3%] md:gap-[2.4%] overflow-visible">
                    <FarSlot item={at(-2)} fadeDir="left" />

                    <NearSlot item={at(-1)} fadeDirMobile="left" />

                    {/* Center slot — Desktop: h-full. Mobile: 75% wide. Aspect ratio keeps w/h proportional. */}
                    <div
                        key={`center-${idx}`} // Ensure proper rendering updates
                        className="relative flex-shrink-0 w-[75%] h-auto md:w-auto md:h-full transition-transform duration-500 ease-out"
                        style={{ aspectRatio: "11/16" }}
                    >
                        <button
                            type="button"
                            className="relative block h-full w-full cursor-pointer overflow-hidden rounded-xl shadow-2xl"
                            onClick={() => setExpanded(true)}
                            title="Открыть подробнее"
                        >
                            <Image
                                src={at(0).src}
                                alt={at(0).alt}
                                fill
                                sizes="(max-width: 768px) 75vw, 32vw"
                                className="object-cover"
                                priority
                            />
                        </button>

                        {/* Social Buttons layer (vertical column above Mother Button) */}
                        <div className={`pointer-events-none absolute flex flex-col-reverse items-center transition-all duration-500 ease-out origin-bottom-left ${isOrderMenuOpen ? 'opacity-100 scale-100 translate-y-0 z-50' : 'opacity-0 scale-50 translate-y-8 z-[-1]'}`}
                            style={{ bottom: "calc(7.25% + max(8px, 2.5%))", left: "2.5%", gap: "max(8px, 2.5%)" }}
                        >
                            <a href="http://t.me/jinnyji" target="_blank" rel="noreferrer"
                                className="pointer-events-auto aspect-square rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                style={{ height: "9cqh" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-transparent mix-blend-screen pointer-events-none"></div>
                                <div className="relative w-[90%] h-[90%]"><Image src="/Telegram_logo.svg.png" alt="TG" fill className="object-contain" /></div>
                            </a>
                            <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                                className="pointer-events-auto aspect-square rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                style={{ height: "9cqh" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-transparent mix-blend-screen pointer-events-none"></div>
                                <div className="relative w-[80%] h-[80%]"><Image src="/Instagram_icon.png" alt="IG" fill className="object-contain" /></div>
                            </a>
                            <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                                className="pointer-events-auto aspect-square rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                style={{ height: "9cqh" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-transparent mix-blend-screen pointer-events-none"></div>
                                <div className="relative w-[110%] h-[110%]"><Image src="/vk-logo.png" alt="VK" fill className="object-contain" /></div>
                            </a>
                        </div>

                        {/* Buttons in the empty bottom zone of the painting card. Positioned with uniform gap of 1.25% on sides and bottom */}
                        <div
                            className="pointer-events-none absolute flex gap-2"
                            style={{ bottom: "1.25%", height: "6%", left: "2.5%", right: "2.5%" }}
                        >
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsOrderMenuOpen(!isOrderMenuOpen); resetTimer(); }}
                                className="pointer-events-auto flex-[2] rounded-xl border border-[#C2185B]/55 bg-white/82 text-[11px] sm:text-[12px] md:text-sm lg:text-[14.5px] font-comfortaa font-bold text-[#C2185B] shadow-lg transition-all hover:bg-white active:scale-[0.98] tracking-widest leading-none flex items-center justify-center"
                            >
                                {isOrderMenuOpen ? 'НАПИШИ МНЕ' : 'ЗАБРОНИРОВАТЬ'}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpanded(true); resetTimer(); }}
                                className="pointer-events-auto flex-[1] rounded-xl border border-[#C2185B]/55 bg-white/82 text-[11px] sm:text-[12px] md:text-sm lg:text-[14px] font-comfortaa font-bold text-[#C2185B] shadow-lg transition-all hover:bg-white active:scale-[0.98] tracking-wide leading-none flex items-center justify-center"
                            >
                                О КАРТИНЕ
                            </button>
                        </div>
                    </div>

                    <NearSlot item={at(1)} fadeDirMobile="right" />

                    <FarSlot item={at(2)} fadeDir="right" />
                </div>
            </div>
        </>
    );
}
