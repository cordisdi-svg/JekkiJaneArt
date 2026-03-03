"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { availablePics } from "@/data/availablePics";

type PaintingItem = (typeof availablePics)[number];

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

// ─── Square crop parameters for expanded view
// (Removed CROP_INSET because we now use pre-cropped 'copy' images from availablepics)

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

// ─── Expanded overlay (covers full viewport including nav) ────────────────────
function ExpandedOverlay({ item, onClose }: { item: PaintingItem; onClose: () => void }) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", h);
        // Hide nav while overlay is open
        document.body.classList.add("overlay-open");
        return () => {
            window.removeEventListener("keydown", h);
            document.body.classList.remove("overlay-open");
        };
    }, [onClose]);

    // Use cropped copy image format (e.g. pic1copy.png)
    const copyUrl = item.src.replace(/\.(png|jpg|jpeg)$/i, (m) => "copy" + m);

    return (
        <div
            className="fixed inset-0 flex flex-col md:flex-row items-center justify-center gap-[4vh] md:gap-[6svh] w-full h-full mx-auto max-w-[1600px] pt-[5vh] px-[2.5vh] pb-[max(5vh,env(safe-area-inset-bottom)+20px)] md:py-[3svh] md:px-[18svh]"
            style={{ zIndex: 9999 }}
            onClick={onClose}
        >
            {/* Full blur backdrop - less intense blur as requested */}
            <div
                aria-hidden
                className="fixed inset-0"
                style={{ backdropFilter: "blur(10px) brightness(0.65)", WebkitBackdropFilter: "blur(10px) brightness(0.65)", zIndex: -1 }}
            />

            {/* Square painting card */}
            <div
                className="relative z-10 w-full aspect-square md:w-auto md:h-full md:max-h-none flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden bg-black/10"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={copyUrl}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 85vh"
                    className="object-cover"
                    priority
                />
            </div>

            {/* Text and Action Window */}
            <div
                className="relative z-10 w-full flex-1 md:flex-1 md:h-full flex flex-col bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 md:p-8 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top 80% Text Area (closes overlay on tap) */}
                <div
                    className="w-full flex-1 cursor-pointer"
                    onClick={onClose}
                    title="Нажмите, чтобы закрыть"
                >
                    {/* Placeholder text zone */}
                </div>

                {/* Bottom 20% Button */}
                <div className="w-full h-[20%] min-h-[65px] flex items-end">
                    <button
                        type="button"
                        className="w-full h-14 md:h-16 rounded-xl bg-[#C2185B]/90 text-white font-bold text-lg hover:bg-[#D81B60] transition shadow-lg backdrop-blur-sm tracking-wide"
                    >
                        Забронировать
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Carousel slot wrappers ───────────────────────────────────────────────────
function FarSlot({ item, fadeDir }: { item: PaintingItem; fadeDir: "left" | "right" }) {
    const maskVal = `linear-gradient(to ${fadeDir}, rgba(0,0,0,0.85) 0%, transparent 100%)`;
    // Mobile hidden, Desktop 25.92% width (90% of Near)
    return (
        <div
            className="relative hidden md:block flex-shrink-0"
            style={{ maskImage: maskVal, WebkitMaskImage: maskVal, aspectRatio: "11/16", filter: "brightness(0.8) blur(3px)", height: "81%" }}
        >
            <Image src={item.src} alt={item.alt} fill sizes="26vw" className="object-cover" />
        </div>
    );
}

function NearSlot({ item, fadeDirMobile }: { item: PaintingItem; fadeDirMobile: "left" | "right" }) {
    const maskValMobile = `linear-gradient(to ${fadeDirMobile}, rgba(0,0,0,0.85) 0%, transparent 100%)`;
    // Mobile 67.5% width (90% of Center), fading. Desktop 28.8% width (90% of Center), no fade.
    return (
        <>
            {/* Mobile rendering for Near slots (acts as far) */}
            <div className="relative md:hidden flex-shrink-0 w-[67.5%]" style={{ maskImage: maskValMobile, WebkitMaskImage: maskValMobile, aspectRatio: "11/16", filter: "brightness(0.85) blur(2px)" }}>
                <Image src={item.src} alt={item.alt} fill sizes="68vw" className="object-cover" />
            </div>
            {/* Desktop rendering for Near slots (no fade) using height-based scaling to 90% */}
            <div className="relative hidden md:block flex-shrink-0" style={{ height: "90%", aspectRatio: "11/16", filter: "brightness(0.9) blur(1.5px)" }}>
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
    const [animKey, setAnimKey] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const throttled = useRef(false);

    const navigate = useCallback((dir: 1 | -1) => {
        if (expanded) return;
        setIdx((i) => mod(i + dir, n));
        setAnimKey((k) => k + 1);
    }, [n, expanded]);

    const next = useCallback(() => navigate(1), [navigate]);
    const prev = useCallback(() => navigate(-1), [navigate]);

    // Non-passive wheel to prevent page scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: WheelEvent) => {
            e.preventDefault();
            if (throttled.current) return;
            throttled.current = true;
            setTimeout(() => (throttled.current = false), 420);
            if (e.deltaY > 0 || e.deltaX > 0) next(); else prev();
        };
        el.addEventListener("wheel", handler, { passive: false });
        return () => el.removeEventListener("wheel", handler);
    }, [next, prev]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null; touchStartY.current = null;
        if (expanded) return;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
        }
    };

    const at = (o: number) => items[mod(idx + o, n)];

    return (
        <>
            {expanded && <ExpandedOverlay item={at(0)} onClose={() => setExpanded(false)} />}

            <style>{`
        @keyframes slotIn {
          from { opacity: 0.5; transform: scale(0.97); }
          to   { opacity: 1;   transform: scale(1); }
        }
        .slot-in { animation: slotIn 0.3s ease forwards; }
      `}</style>

            {/* 
        Use absolute inset so the carousel doesn't create any overflow.
        The parent in page.tsx gives this div a defined height via flex-1.
      */}
            <div
                ref={containerRef}
                className="relative flex h-full w-full select-none items-center justify-center overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <ArrowBtn direction="left" onClick={prev} />
                <ArrowBtn direction="right" onClick={next} />

                {/* Track: slots centered with responsive uniform gaps */}
                <div className="flex h-full w-full items-center justify-center gap-[3%] md:gap-[2.4%] overflow-visible">
                    <FarSlot item={at(-2)} fadeDir="left" />

                    <NearSlot item={at(-1)} fadeDirMobile="left" />

                    {/* Center slot — key changes on nav to trigger animation */}
                    {/* Desktop: h-full. Mobile: 75% wide. Aspect ratio keeps w/h proportional. */}
                    <div
                        key={animKey}
                        className="slot-in relative flex-shrink-0 w-[75%] h-auto md:w-auto md:h-full"
                        style={{ aspectRatio: "11/16" }}
                    >
                        <button
                            type="button"
                            className="relative block h-full w-full cursor-pointer overflow-hidden rounded-md"
                            onClick={() => setExpanded(true)}
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

                        {/* Buttons in the empty bottom zone of the painting card. Adjusted height/bottom to prevent overlap with text */}
                        <div
                            className="pointer-events-none absolute flex gap-2"
                            style={{ bottom: "1%", height: "5.5%", left: "14%", right: "14%" }}
                        >
                            <button
                                type="button"
                                className="pointer-events-auto flex-[2] rounded-lg border border-[#C2185B]/55 bg-white/82 text-[10px] sm:text-[11px] font-semibold text-[#C2185B] backdrop-blur transition hover:bg-white/96 md:text-sm lg:text-[13px]"
                            >
                                Забронировать
                            </button>
                            <button
                                type="button"
                                className="pointer-events-auto flex-[1] rounded-lg border border-[#C2185B]/55 bg-white/82 text-[10px] sm:text-[11px] font-semibold text-[#C2185B] backdrop-blur transition hover:bg-white/96 md:text-sm lg:text-[13px]"
                            >
                                О картине
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
