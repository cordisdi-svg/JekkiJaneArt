"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const AMULET_IMAGES = [
    { src: "/amulets/1.png", alt: "Amulet 1" },
    { src: "/amulets/2.png", alt: "Amulet 2" },
    { src: "/amulets/3.png", alt: "Amulet 3" },
    { src: "/amulets/4.JPEG", alt: "Amulet 4" },
    { src: "/amulets/5.png", alt: "Amulet 5" },
    { src: "/amulets/6.png", alt: "Amulet 6" },
    { src: "/amulets/7.png", alt: "Amulet 7" },
];

type CarouselItem = typeof AMULET_IMAGES[number];

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

// Sequence Definitions
const SEQUENCES = [
    { images: ["/amulets/for-man1.png", "/amulets/for-man2.png"], btnSrc: "/amulets/for-man1-button.png", label: "Для\nмужчин" },
    { images: ["/amulets/for-woman1.png", "/amulets/for-woman2.png"], btnSrc: "/amulets/for-woman1-button.png", label: "Для\nженщин" },
    { images: ["/amulets/for-pairs.png", "/amulets/for-pairs.png"], btnSrc: "/amulets/for-pairs-button.png", label: "Для\nпар" }
];

// ─── Arrow button ─────────────────────────────────────────────────────────────
function ArrowBtn({ direction, onClick, disabled }: { direction: "left" | "right"; onClick: () => void; disabled?: boolean }) {
    if (disabled) return null;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={direction === "left" ? "Предыдущая" : "Следующая"}
            className="absolute top-0 z-30 flex h-full cursor-pointer items-center justify-center opacity-55 transition-opacity hover:opacity-90 active:scale-95"
            style={{ [direction]: 0, width: "36px" }}
        >
            <svg viewBox="0 0 12 34" className="h-20 w-6" fill="rgba(255,255,255,0.92)" aria-hidden>
                {direction === "left"
                    ? <path d="M11 1 1 17l10 16V1Z" />
                    : <path d="M1 1l10 16L1 33V1Z" />}
            </svg>
        </button>
    );
}

// ─── Carousel slot wrappers ───────────────────────────────────────────────────
function FarSlot({ item, fadeDir, isBlurred = false }: { item: CarouselItem; fadeDir: "left" | "right"; isBlurred?: boolean }) {
    const maskVal = `linear-gradient(to ${fadeDir}, rgba(0,0,0,0.85) 0%, transparent 100%)`;
    const currentFilter = isBlurred ? "brightness(0.5) blur(7.3px)" : "brightness(0.8) blur(3.3px)";
    return (
        <div
            className="relative flex-shrink-0 rounded-[2rem] overflow-hidden drop-shadow-2xl transition-[filter] duration-700 ease-in-out"
            style={{ maskImage: maskVal, WebkitMaskImage: maskVal, aspectRatio: "11/16", filter: currentFilter, height: "81%" }}
        >
            <Image src={item.src} alt={item.alt} fill sizes="26vw" className="object-contain" />
        </div>
    );
}

function NearSlot({ item, isBlurred = false }: { item: CarouselItem; isBlurred?: boolean }) {
    const currentFilter = isBlurred ? "brightness(0.6) blur(5.7px)" : "brightness(0.9) blur(1.7px)";
    return (
        <div
            className="relative flex-shrink-0 rounded-[2rem] overflow-hidden drop-shadow-2xl transition-[filter] duration-700 ease-in-out"
            style={{ height: "90%", aspectRatio: "11/16", filter: currentFilter }}
        >
            <Image src={item.src} alt={item.alt} fill sizes="29vw" className="object-contain" />
        </div>
    );
}

// ─── Interative Sequence Renderers ────────────────────────────────────────────
function SequenceSpotlight({ flipped, images, rounded = true }: { flipped: boolean; images: string[]; rounded?: boolean }) {
    const hasBack = images.length > 1;

    return (
        <div className="relative h-full w-auto flex items-center justify-center perspective-[2000px]">
            <div
                className="relative h-full w-auto transition-all duration-[2500ms] ease-in-out"
                style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
            >
                <div className="relative h-full w-auto backface-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}>
                    <Image src={images[0]} alt="Sequence Part 1" width={500} height={800} sizes="32vw" className={`h-full w-auto object-contain ${rounded ? 'rounded-[2rem]' : ''}`} priority />
                </div>
                {hasBack && (
                    <div className="absolute inset-0 backface-hidden flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <Image src={images[1]} alt="Sequence Part 2" width={500} height={800} sizes="32vw" className={`h-full w-auto object-contain ${rounded ? 'rounded-[2rem]' : ''}`} priority />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AmuletsCarousel() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return <AmuletsMobileCarousel />;
    }

    return <AmuletsDesktopCarousel />;
}

// ─── Desktop Implementation ─────────────────────────────────────────
function AmuletsDesktopCarousel() {
    const items = AMULET_IMAGES;
    const n = items.length;
    const [idx, setIdx] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
    const [showEighthSprite, setShowEighthSprite] = useState(false);

    const [isPaused, setIsPaused] = useState(false);
    const [delayedSparkle, setDelayedSparkle] = useState(false);

    type ActiveSeqState = { seqIdx: number; flipped: boolean };
    const [activeSeq, setActiveSeq] = useState<ActiveSeqState | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const throttled = useRef(false);

    const navigate = useCallback((dir: 1 | -1) => {
        if (activeSeq !== null) return;
        setIdx((i) => mod(i + dir, n));
        setAnimKey((k) => k + 1);
    }, [n, activeSeq]);

    const next = useCallback(() => navigate(1), [navigate]);
    const prev = useCallback(() => navigate(-1), [navigate]);

    const handleLoop = useCallback(() => {
        if (activeSeq === null) {
            next();
        } else {
            if (!activeSeq.flipped) {
                setActiveSeq(prev => prev ? { ...prev, flipped: true } : null);
            }
        }
        setIsOrderMenuOpen(false);
        setShowEighthSprite(false);
    }, [activeSeq, next]);

    const handleStartSequence = (seqIdx: number) => {
        if (activeSeq?.seqIdx === seqIdx) {
            setActiveSeq(null);
            setIsOrderMenuOpen(false);
            setShowEighthSprite(false);
        } else {
            setActiveSeq({ seqIdx, flipped: seqIdx === 2 });
            setIsOrderMenuOpen(false);
            setShowEighthSprite(false);
        }
        setIsPaused(false);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: WheelEvent) => {
            e.preventDefault();
            if (activeSeq !== null) {
                if (activeSeq.seqIdx !== 2) {
                    if (throttled.current) return;
                    throttled.current = true;
                    setTimeout(() => (throttled.current = false), 420);
                    if (e.deltaY > 0 || e.deltaX > 0) {
                        setActiveSeq(prev => prev ? { ...prev, flipped: true } : null);
                    } else {
                        if (activeSeq.flipped) {
                            setDelayedSparkle(true);
                            setTimeout(() => setDelayedSparkle(false), 2500);
                        }
                        setActiveSeq(prev => prev ? { ...prev, flipped: false } : null);
                    }
                }
                return;
            }
            if (throttled.current) return;
            throttled.current = true;
            setTimeout(() => (throttled.current = false), 420);
            if (e.deltaY > 0 || e.deltaX > 0) next(); else prev();
        };
        el.addEventListener("wheel", handler, { passive: false });

        let startY = 0;
        const touchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
        const touchMove = (e: TouchEvent) => {
            if (activeSeq !== null && activeSeq.seqIdx !== 2) {
                e.preventDefault();
                const dy = startY - e.touches[0].clientY;
                if (Math.abs(dy) > 30) {
                    if (throttled.current) return;
                    throttled.current = true;
                    setTimeout(() => (throttled.current = false), 420);
                    if (dy > 0) {
                        setActiveSeq(prev => prev ? { ...prev, flipped: true } : null);
                    } else {
                        if (activeSeq.flipped) {
                            setDelayedSparkle(true);
                            setTimeout(() => setDelayedSparkle(false), 2500);
                        }
                        setActiveSeq(prev => prev ? { ...prev, flipped: false } : null);
                    }
                }
            }
        };
        el.addEventListener("touchstart", touchStart, { passive: true });
        el.addEventListener("touchmove", touchMove, { passive: false });

        return () => {
            el.removeEventListener("wheel", handler);
            el.removeEventListener("touchstart", touchStart);
            el.removeEventListener("touchmove", touchMove);
        };
    }, [next, prev, activeSeq]);

    const at = (o: number) => items[mod(idx + o, n)];

    const renderCenterContent = () => {
        let content;
        if (showEighthSprite) {
            content = (
                <div className="relative flex h-full items-center justify-center">
                    <Image
                        src="/amulets/8.png"
                        alt="Amulet 8"
                        width={500}
                        height={800}
                        sizes="32vw"
                        className="h-full w-auto object-contain rounded-[2rem]"
                        priority
                    />
                </div>
            );
        } else if (activeSeq !== null) {
            content = <SequenceSpotlight flipped={activeSeq.flipped} images={SEQUENCES[activeSeq.seqIdx].images} />;
        } else {
            content = (
                <div className="relative flex h-full items-center justify-center">
                    <Image
                        src={at(0).src}
                        alt={at(0).alt}
                        width={500}
                        height={800}
                        sizes="32vw"
                        className="h-full w-auto object-contain rounded-[2rem]"
                        priority
                    />
                </div>
            );
        }

        const showOrderBtn = (activeSeq !== null && activeSeq.flipped) || (idx === 6 && activeSeq === null);

        return (
            <>
                {content}
                {showOrderBtn && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+90px)] w-[170px] h-[170px] z-50">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[221px] h-[221px] rounded-full pointer-events-none z-0 animate-golden-aura mix-blend-screen"></div>

                        <a href="https://t.me/Jekki_Jane" target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out group flex items-center justify-center rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden w-[85px] h-[85px] 
                           ${isOrderMenuOpen ? 'mt-[calc(-42.5px-170px)] ml-[-42.5px] opacity-100 scale-100 hover:scale-110 mini-btn-wrapper' : 'mt-[-42.5px] ml-[-42.5px] opacity-0 scale-50 pointer-events-none'}`}>
                            <Image src="/Telegram_logo.svg.png" alt="TG" fill className="object-cover" />
                        </a>
                        <a href="https://instagram.com/jekki_jane" target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out group flex items-center justify-center rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden w-[85px] h-[85px] 
                           ${isOrderMenuOpen ? 'mt-[calc(-42.5px-120px)] ml-[calc(-42.5px+120px)] opacity-100 scale-100 hover:scale-110 mini-btn-wrapper' : 'mt-[-42.5px] ml-[-42.5px] opacity-0 scale-50 pointer-events-none'}`} style={{ transitionDelay: '50ms' }}>
                            <Image src="/Instagram_icon.png" alt="IG" fill className="object-cover" />
                        </a>
                        <a href="https://vk.com/jekkijane" target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out group flex items-center justify-center rounded-full border-[2px] border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden w-[85px] h-[85px] 
                           ${isOrderMenuOpen ? 'mt-[-42.5px] ml-[calc(-42.5px+170px)] opacity-100 scale-100 hover:scale-110 mini-btn-wrapper' : 'mt-[-42.5px] ml-[-42.5px] opacity-0 scale-50 pointer-events-none'}`} style={{ transitionDelay: '100ms' }}>
                            <Image src="/vk-logo.png" alt="VK" fill className="object-cover" />
                        </a>
                        <button onClick={(e) => { e.stopPropagation(); setShowEighthSprite(prev => !prev); }}
                            className={`pointer-events-auto absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out group flex items-center justify-center rounded-full border-[2px] ${showEighthSprite ? 'border-[rgba(255,36,0,0.8)] drop-shadow-[0_0_15px_rgba(255,36,0,0.6)]' : 'border-white/40 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]'} overflow-hidden w-[119px] h-[119px] 
                           ${isOrderMenuOpen ? `mt-[calc(-59.5px+204px)] ml-[-59.5px] opacity-100 scale-100 ${showEighthSprite ? '' : 'hover:scale-110'}` : 'mt-[-59.5px] ml-[-59.5px] opacity-0 scale-50 pointer-events-none'}`} style={{ transitionDelay: '150ms' }}>
                            <Image src="/amulets/8-button.png" alt="8" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className={`absolute inset-0 transition-colors duration-300 z-10 ${showEighthSprite ? 'bg-black/10' : 'bg-black/40 group-hover:bg-black/20'}`} />
                            <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[20px] xl:text-[25px] tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2 whitespace-nowrap">
                                В ПОДАРОК
                            </span>
                        </button>

                        <button
                            className={`absolute inset-0 w-[170px] h-[170px] rounded-full border-[3px] flex items-center justify-center overflow-hidden group cursor-pointer transition-transform z-20 pointer-events-auto btn-wrapper ${isOrderMenuOpen ? 'btn-active-wrapper border-[rgba(255,36,0,0.8)] drop-shadow-[0_0_15px_rgba(255,36,0,0.6)]' : 'border-white/40 hover:scale-105'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOrderMenuOpen) {
                                    setIsOrderMenuOpen(false);
                                    setShowEighthSprite(false);
                                } else {
                                    setIsOrderMenuOpen(true);
                                }
                            }}
                        >
                            <Image src="/amulets/1-button.png" alt="Заказать" fill sizes="170px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className={`absolute inset-0 transition-colors duration-300 z-10 ${isOrderMenuOpen ? 'bg-black/10' : 'bg-black/40 group-hover:bg-black/20'}`} />
                            <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[25px] xl:text-[31px] tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
                                {isOrderMenuOpen ? 'НАПИШИ МНЕ' : 'ЗАКАЗАТЬ'}
                            </span>
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <style>{`
        @keyframes slotIn {
          from { opacity: 0.5; transform: scale(0.97); }
          to   { opacity: 1;   transform: scale(1); }
        }
        .slot-in { animation: slotIn 0.3s ease forwards; }

        @keyframes sparkle-run {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: 0; }
        }

        @keyframes btnBreathe {
          0% { transform: scale(1); }
          100% { transform: scale(var(--btn-scale-min, 0.85)); }
        }
        .btn-wrapper {
            --btn-scale-min: 0.85;
            animation: btnBreathe 2.5s infinite alternate ease-in-out;
            will-change: transform;
        }
        .btn-wrapper:hover {
            --btn-scale-min: 1; 
        }
        .btn-active-wrapper {
            --btn-scale-min: 1; 
        }
        
        @keyframes miniBreathe {
          0% { transform: scale(1); }
          100% { transform: scale(0.95); }
        }
        .mini-btn-wrapper {
            animation: miniBreathe 2.5s infinite alternate ease-in-out;
            will-change: transform;
        }
        .mini-btn-wrapper:hover {
            animation-play-state: paused;
        }

        @keyframes goldenAura {
            0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95) rotate(0deg); }
            50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.05) rotate(5deg); }
            100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95) rotate(0deg); }
        }
        .animate-golden-aura {
            animation: goldenAura 3.5s infinite ease-in-out alternate;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.7) 0%, rgba(255, 180, 0, 0.4) 40%, transparent 70%);
            filter: blur(8px);
        }
      `}</style>

            <div
                ref={containerRef}
                className="relative flex h-full w-full select-none items-center justify-center overflow-hidden"
                onPointerDown={() => setIsPaused(true)}
                onPointerUp={() => setIsPaused(false)}
                onPointerLeave={() => setIsPaused(false)}
                onPointerCancel={() => setIsPaused(false)}
            >
                <ArrowBtn direction="left" onClick={prev} disabled={activeSeq !== null} />
                <ArrowBtn direction="right" onClick={next} disabled={activeSeq !== null} />

                <div className="absolute left-[30px] top-0 bottom-0 w-[250px] flex flex-col justify-center items-center gap-10 z-[100] pointer-events-none">
                    {SEQUENCES.map((seq, i) => {
                        const isActive = activeSeq !== null && activeSeq.seqIdx === i;
                        return (
                            <div key={i} className={`btn-wrapper pointer-events-auto rounded-full ${isActive ? 'btn-active-wrapper' : ''}`}>
                                <button
                                    onPointerDown={(e) => { e.stopPropagation(); }}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStartSequence(i); }}
                                    className={`relative flex items-center justify-center cursor-pointer overflow-hidden w-[170px] h-[170px] rounded-full border-[3px] 
                                    ${isActive ? 'border-[rgba(255,36,0,0.8)] drop-shadow-[0_0_15px_rgba(255,36,0,0.6)]' : 'border-white/40'} 
                                    drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group transition-all duration-300`}
                                >
                                    <Image src={seq.btnSrc} alt={seq.label} fill sizes="170px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className={`absolute inset-0 transition-colors duration-300 z-10 ${isActive ? 'bg-black/10' : 'bg-black/50 group-hover:bg-black/30'}`} />
                                    <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[20px] xl:text-[25px] tracking-wide text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2 whitespace-pre-line">
                                        {seq.label.toUpperCase()}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex h-full w-full items-center justify-center gap-[2.4%] overflow-visible">
                    <FarSlot item={at(-2)} fadeDir="left" isBlurred={activeSeq !== null} />
                    <NearSlot item={at(-1)} isBlurred={activeSeq !== null} />

                    <div
                        key={activeSeq !== null ? `seq-${activeSeq.seqIdx}` : animKey}
                        className="slot-in relative flex-shrink-0 h-full rounded-[2rem] drop-shadow-2xl flex items-center justify-center w-auto z-40"
                    >
                        {renderCenterContent()}
                        {(!activeSeq || !activeSeq.flipped) && !showEighthSprite && (idx !== 6 || activeSeq !== null) && (
                            <SparkleBorder
                                key={`sparkle-${activeSeq?.seqIdx}-${activeSeq?.flipped}-${animKey}-${Math.random()}`}
                                isPaused={isPaused || delayedSparkle}
                                onLoop={handleLoop}
                                duration={activeSeq !== null ? "5s" : "7s"}
                            />
                        )}
                    </div>

                    <NearSlot item={at(1)} isBlurred={activeSeq !== null} />
                    <FarSlot item={at(2)} fadeDir="right" isBlurred={activeSeq !== null} />
                </div>
            </div>
        </>
    );
}

// ─── Mobile Implementation (Deck Sweep) ──────────────────────────────────────
// ─── Mobile Implementation (Deck Sweep) ──────────────────────────────────────
function AmuletsMobileCarousel() {
    const items = AMULET_IMAGES;
    const n = items.length;
    const [idx, setIdx] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // States ported from Desktop
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
    const [showEighthSprite, setShowEighthSprite] = useState(false);
    type ActiveSeqState = { seqIdx: number; flipped: boolean };
    const [activeSeq, setActiveSeq] = useState<ActiveSeqState | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const touchY = useRef(0);

    const next = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIdx((i) => mod(i + 1, n));
            setIsAnimating(false);
        }, 2000); // 2s duration as requested
    }, [isAnimating, n]);

    // Handle sequence logic (ported from desktop)
    const handleStartSequence = (seqIdx: number) => {
        if (activeSeq?.seqIdx === seqIdx) {
            setActiveSeq(null);
            setIsOrderMenuOpen(false);
            setShowEighthSprite(false);
        } else {
            setActiveSeq({ seqIdx, flipped: seqIdx === 2 }); // "Для пар" (index 2) starts flipped
            setIsOrderMenuOpen(false);
            setShowEighthSprite(false);
        }
        setIsPaused(false);
    };

    // Auto-play timer (ported and adapted)
    useEffect(() => {
        // Stop auto-scroll if reached 7.png (idx 6) and no sequence active
        if (isPaused || isAnimating || (idx === 6 && activeSeq === null)) return;
        const timer = setInterval(() => {
            if (activeSeq === null) {
                next();
            } else {
                if (!activeSeq.flipped) {
                    setActiveSeq(prev => prev ? { ...prev, flipped: true } : null);
                }
            }
        }, 7000); // 7s interval
        return () => clearInterval(timer);
    }, [isPaused, isAnimating, next, activeSeq, idx]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dy = touchY.current - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 50) { // Vertical swipe
            if (dy > 50) { // Swipe up
                if (activeSeq === null) {
                    next();
                } else if (!activeSeq.flipped) {
                    setActiveSeq(prev => prev ? { ...prev, flipped: true } : null);
                }
            } else { // Swipe down
                if (activeSeq !== null && activeSeq.flipped) {
                    // Manual flip back
                    setActiveSeq(prev => prev ? { ...prev, flipped: false } : null);
                }
            }
        }
    };

    // Shared content renderer (ported from desktop)
    const renderCenterContent = () => {
        if (showEighthSprite) {
            return (
                <div className="relative flex h-full items-center justify-center">
                    <Image src="/amulets/8.png" alt="Amulet 8" width={500} height={800} sizes="80vw" className="h-full w-auto object-contain" priority />
                </div>
            );
        }
        if (activeSeq !== null) {
            return <SequenceSpotlight flipped={activeSeq.flipped} images={SEQUENCES[activeSeq.seqIdx].images} rounded={false} />;
        }
        return (
            <div className="relative flex h-full items-center justify-center">
                <Image src={items[idx].src} alt={items[idx].alt} width={500} height={800} sizes="80vw" className="h-full w-auto object-contain" priority />
            </div>
        );
    };

    const showOrderBtn = (activeSeq !== null && activeSeq.flipped) || (idx === 6 && activeSeq === null);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
                if (isOrderMenuOpen) setIsOrderMenuOpen(false);
                else setIsPaused(p => !p);
            }}
        >
            <style>{`
                @keyframes deck-sweep-out {
                    0% { transform: scale(1) translateY(0); opacity: 1; z-index: 20; }
                    30% { transform: scale(0.9) translateY(-10%); opacity: 1; z-index: 20; }
                    100% { transform: scale(0.8) translateY(-130%); opacity: 0; z-index: 20; }
                }
                @keyframes deck-sweep-in {
                    0% { transform: scale(0.95); filter: brightness(0.3); z-index: 10; }
                    100% { transform: scale(1); filter: brightness(1); z-index: 20; }
                }
                .card-exit { animation: deck-sweep-out 2s forwards ease-in-out; }
                .card-enter { animation: deck-sweep-in 2s forwards ease-in-out; }

                /* Animations ported from desktop */
                @keyframes btnBreathe {
                    0% { transform: scale(1); }
                    100% { transform: scale(var(--btn-scale-min, 0.85)); }
                }
                .btn-wrapper {
                    --btn-scale-min: 0.85;
                    animation: btnBreathe 2.5s infinite alternate ease-in-out;
                    will-change: transform;
                }
                .btn-active-wrapper { --btn-scale-min: 1; }

                @keyframes miniBreathe {
                    0% { transform: scale(1); }
                    100% { transform: scale(0.95); }
                }
                .mini-btn-wrapper {
                    animation: miniBreathe 2.5s infinite alternate ease-in-out;
                    will-change: transform;
                }

                @keyframes goldenAura {
                    0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95) rotate(0deg); }
                    50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.05) rotate(5deg); }
                    100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95) rotate(0deg); }
                }
                .animate-golden-aura {
                    animation: goldenAura 3.5s infinite ease-in-out alternate;
                    background: radial-gradient(circle, rgba(255, 215, 0, 0.7) 0%, rgba(255, 180, 0, 0.4) 40%, transparent 70%);
                    filter: blur(8px);
                }
            `}</style>

            {/* Main Carousel Area (Full Height, Overlaying Buttons) */}
            <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                {/* Next Card (Underneath) */}
                {activeSeq === null && !showEighthSprite && idx < 6 && (
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ${isAnimating ? "card-enter" : ""}`}
                        style={{
                            transform: isAnimating ? "" : "scale(0.95)",
                            filter: isAnimating ? "" : "brightness(0.3)",
                            zIndex: 10,
                        }}
                    >
                        <div className="relative w-full h-full aspect-[11/16]">
                            <Image src={items[mod(idx + 1, n)].src} alt="Next" fill className="object-contain drop-shadow-2xl" />
                        </div>
                    </div>
                )}

                {/* Current Content (On top) */}
                <div
                    key={activeSeq !== null ? `seq-${activeSeq.seqIdx}` : showEighthSprite ? 'eighth' : idx}
                    className={`absolute inset-0 flex items-center justify-center ${isAnimating ? "card-exit" : "slot-in"}`}
                    style={{ zIndex: 20 }}
                >
                    <div className="relative w-full h-full aspect-[11/16]">
                        {renderCenterContent()}
                    </div>
                </div>

                {/* Order Button (Top-Right of active area) */}
                {showOrderBtn && (
                    <div className="absolute top-2 right-2 w-[85px] h-[85px] z-50">
                        {/* Golden Aura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] rounded-full pointer-events-none z-0 animate-golden-aura mix-blend-screen"></div>

                        {/* Child Buttons: Socials Bottom-Left column-diagonal */}
                        <a href="https://vk.com/jekkijane" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute transition-all duration-500 ease-in-out flex items-center justify-center rounded-full border border-white/40 drop-shadow-md overflow-hidden w-[40px] h-[40px] mini-btn-wrapper
                            ${isOrderMenuOpen ? 'top-[-5px] right-[105px] opacity-100 scale-100' : 'top-[22px] right-[22px] opacity-0 scale-50 pointer-events-none'}`}>
                            <Image src="/vk-logo.png" alt="VK" fill className="object-cover" />
                        </a>
                        <a href="https://instagram.com/jekki_jane" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute transition-all duration-500 ease-in-out flex items-center justify-center rounded-full border border-white/40 drop-shadow-md overflow-hidden w-[40px] h-[40px] mini-btn-wrapper
                            ${isOrderMenuOpen ? 'top-[29px] right-[113px] opacity-100 scale-100' : 'top-[22px] right-[22px] opacity-0 scale-50 pointer-events-none'}`} style={{ transitionDelay: '50ms' }}>
                            <Image src="/Instagram_icon.png" alt="IG" fill className="object-cover" />
                        </a>
                        <a href="https://t.me/Jekki_Jane" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                            className={`pointer-events-auto absolute transition-all duration-500 ease-in-out flex items-center justify-center rounded-full border border-white/40 drop-shadow-md overflow-hidden w-[40px] h-[40px] mini-btn-wrapper
                            ${isOrderMenuOpen ? 'top-[60px] right-[97px] opacity-100 scale-100' : 'top-[22px] right-[22px] opacity-0 scale-50 pointer-events-none'}`} style={{ transitionDelay: '100ms' }}>
                            <Image src="/Telegram_logo.svg.png" alt="TG" fill className="object-cover" />
                        </a>

                        {/* Gift Button below socials - Strictly centered under mother */}
                        <button onClick={(e) => { e.stopPropagation(); setShowEighthSprite(prev => !prev); }}
                            className={`pointer-events-auto absolute transition-all duration-500 ease-in-out flex items-center justify-center rounded-full border-2 ${showEighthSprite ? 'border-[rgba(255,36,0,0.8)] shadow-[0_0_10px_rgba(255,36,0,0.5)]' : 'border-white/40'} overflow-hidden w-[65px] h-[65px]
                            ${isOrderMenuOpen ? 'top-[160px] left-1/2 opacity-100 scale-100' : 'top-[10px] left-1/2 opacity-0 scale-50 pointer-events-none'}`}
                            style={{ transform: 'translateX(-50%)', transitionDelay: '150ms' }}>
                            <Image src="/amulets/8-button.png" alt="8" fill className="object-cover" />
                            <div className={`absolute inset-0 z-10 ${showEighthSprite ? 'bg-black/10' : 'bg-black/40'}`} />
                            <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[10px] leading-tight text-center drop-shadow-md px-1 uppercase">В подарок</span>
                        </button>

                        {/* Mother Button */}
                        <button
                            onPointerDown={() => setIsPaused(true)}
                            onPointerUp={() => setIsPaused(false)}
                            className={`absolute inset-0 w-[85px] h-[85px] rounded-full border-2 flex items-center justify-center overflow-hidden group transition-all z-20 pointer-events-auto btn-wrapper ${isOrderMenuOpen ? 'btn-active-wrapper border-[rgba(255,36,0,0.8)] shadow-[0_0_12px_rgba(255,36,0,0.6)]' : 'border-white/40'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOrderMenuOpen(!isOrderMenuOpen);
                            }}
                        >
                            <Image src="/amulets/1-button.png" alt="Заказать" fill className="object-cover" />
                            <div className={`absolute inset-0 z-10 ${isOrderMenuOpen ? 'bg-black/10' : 'bg-black/40'}`} />
                            <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[13px] leading-tight text-center drop-shadow-md uppercase">
                                {isOrderMenuOpen ? 'Напиши мне' : 'Заказать'}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Control Area (Overlay Bottom 15%) - Constrained to Image Width */}
            <div className="absolute bottom-0 left-0 right-0 h-[15%] flex items-center justify-center z-30 pointer-events-none px-4 pb-2">
                <div className="h-full aspect-[11/16] max-h-full flex items-center justify-evenly pointer-events-auto" style={{ width: 'calc((100vh - var(--nav-height-mobile) - 1rem) * 0.85 * 11 / 16)' }}>
                    {SEQUENCES.map((seq, i) => {
                        const isActive = activeSeq !== null && activeSeq.seqIdx === i;
                        return (
                            <div key={i} className={`btn-wrapper h-full aspect-square rounded-full ${isActive ? 'btn-active-wrapper' : ''}`}>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStartSequence(i); }}
                                    className={`relative w-full h-full flex items-center justify-center rounded-full border-2 ${isActive ? 'border-[rgba(255,36,0,0.8)] shadow-[0_0_10px_rgba(255,36,0,0.5)]' : 'border-white/40'} overflow-hidden transition-all duration-300 drop-shadow-lg`}
                                >
                                    <Image src={seq.btnSrc} alt={seq.label} fill className="object-cover" />
                                    <div className={`absolute inset-0 z-10 ${isActive ? 'bg-black/10' : 'bg-black/50'}`} />
                                    <span style={{ fontFamily: "Fontatica4F" }} className="relative z-20 text-white text-[13px] leading-tight text-center drop-shadow-md px-1 whitespace-pre-line uppercase">
                                        {seq.label}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pause indicator */}
            {isPaused && (
                <div className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1.5 rounded-full text-[13px] backdrop-blur-md z-[60] font-comfortaa-light border border-white/20 animate-pulse">
                    ПАУЗА
                </div>
            )}
        </div>
    );
}

function SparkleBorder({ isPaused, onLoop, duration }: { isPaused: boolean; onLoop: () => void; duration: string }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-20">
            <svg className="absolute inset-0 h-full w-full drop-shadow-[0_0_8px_rgba(255,36,0,0.8)] xl:drop-shadow-[0_0_12px_rgba(255,36,0,0.9)]">
                <rect
                    x="1" y="1"
                    width="calc(100% - 2px)" height="calc(100% - 2px)"
                    rx="31"
                    fill="none"
                    stroke="rgba(255, 36, 0)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength="100"
                    onAnimationIteration={onLoop}
                    style={{
                        strokeDasharray: "100",
                        animation: `sparkle-run ${duration} linear infinite`,
                        animationPlayState: isPaused ? "paused" : "running",
                    }}
                />
            </svg>
        </div>
    );
}
