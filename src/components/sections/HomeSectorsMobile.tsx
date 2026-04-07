"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Slide data ───────────────────────────────────────────────────────────────

const AVAILABLE_POOL = [
  "/availablepics/back1.webp",
  "/availablepics/back2.webp",
  "/availablepics/back3.webp",
];

const WEAR_POOL = [
  "/wear-and-shoes/5.webp",
  "/wear-and-shoes/2.webp",
  "/wear-and-shoes/3.webp",
];

function pickRandom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

interface Slide {
  id: number;
  imageSrc: string;
  heading: string;
  sub: string;
  href: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeSectorsMobile() {
  const router = useRouter();

  // Random picks are stable for the lifetime of this component instance
  const slides: Slide[] = useMemo(() => [
    { id: 1, imageSrc: pickRandom(AVAILABLE_POOL), heading: "Доступные картины",  sub: "просто выбери и закажи",                           href: "/available"     },
    { id: 2, imageSrc: "/walls/1.webp",             heading: "Создание на заказ",  sub: "опиши свою идею и я воплощу её",                   href: "/picstoorder"   },
    { id: 3, imageSrc: "/walls/3.webp",             heading: "Интерьеры",          sub: "Сделаю твоё пространство уникальным арт-объектом", href: "/walls"         },
    { id: 4, imageSrc: "/amulets/mobile-main.webp", heading: "Картины-талисманы",  sub: "Создам твой личный проводник энергии и намерений", href: "/amulets"       },
    { id: 5, imageSrc: pickRandom(WEAR_POOL),       heading: "Роспись одежды",     sub: "Сделаю твой образ неповторимым",                   href: "/wear-and-shoes"},
    { id: 6, imageSrc: "/tattoo/1-mobile.webp",     heading: "Тату-эскизы",        sub: "Разработаю дизайн твоей татуировки",               href: "/tattoo"        },
    { id: 7, imageSrc: "/mainpage/mainpage-back.webp", heading: "",               sub: "",                                                 href: null             },
  ], []);

  const N = slides.length;

  // ─── Slider state ───────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);
  const startX = useRef(0);

  const resetAnimating = useCallback(() => {
    isAnimating.current = false;
  }, []);

  const startSlideTransition = useCallback((newIndex: number) => {
    isAnimating.current = true;
    setCurrentIndex(newIndex);

    // Reset animating via transitionend (solution #10 — safety timeout parallel)
    const safetyTimer = setTimeout(resetAnimating, 600);
    sliderTrackRef.current?.addEventListener("transitionend", () => {
      clearTimeout(safetyTimer);
      resetAnimating();
    }, { once: true });
  }, [resetAnimating]);

  const handleSwipe = useCallback((direction: "up" | "down") => {
    if (direction === "up") {
      startSlideTransition((currentIndex + 1) % N);
    } else {
      startSlideTransition((currentIndex - 1 + N) % N);
    }
  }, [currentIndex, N, startSlideTransition]);

  // ─── Touch handlers (solution #6 — touchstart stays passive) ───────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy = startY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(startX.current - e.changedTouches[0].clientX);

    // Ignore horizontal swipes and short taps
    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return;
    // Guard: only blocks the action, not the event handler itself
    if (isAnimating.current) return;

    handleSwipe(dy > 0 ? "up" : "down");
  }, [handleSwipe]);

  // ─── Tap handler (solution #3 — guard for href:null) ───────────────────────
  const handleTap = useCallback((slide: Slide) => {
    if (!slide.href) return;
    console.log("Navigate to:", slide.href); // will be replaced in Step 4
  }, []);

  const handleIconTap = useCallback(() => {
    console.log("Navigate to: /about"); // will be replaced in Step 4
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    // Fixed wrapper — NO transform here (solution #2)
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 10 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* SliderTrack — transform ONLY here */}
      <div
        ref={sliderTrackRef}
        style={{
          position: "absolute",
          inset: 0,
          height: `${N * 100}svh`,
          transform: `translateY(-${currentIndex * 100}svh)`,
          transition: "transform 550ms cubic-bezier(0.77,0,0.175,1)",
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => handleTap(slide)}
            style={{
              position: "relative",
              width: "100%",
              height: "100svh",
              overflow: "hidden",
              cursor: slide.href ? "pointer" : "default",
            }}
          >
            {/* Background image */}
            <Image
              src={slide.imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
              priority={slide.id === 1}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Heading — top left */}
            {slide.heading && (
              <div className="absolute top-[4%] left-[5%] right-[5%] z-10">
                <span className="block font-fontatica uppercase tracking-wide text-[#f0ede6]"
                  style={{ fontSize: "clamp(1.9rem, 8.5vw, 2.6rem)" }}>
                  {slide.heading}
                </span>
              </div>
            )}

            {/* Sub — bottom right */}
            {slide.sub && (
              <div className="absolute bottom-[6%] right-[4%] z-10"
                style={{ maxWidth: "58vw" }}>
                <span className="block font-comfortaa-light text-right text-[rgba(240,237,230,0.88)]"
                  style={{ fontSize: "clamp(0.9rem, 4vw, 1.25rem)" }}>
                  {slide.sub}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FloatingIcon — SIBLING of SliderTrack, not inside transform (solution #2) */}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
          left: 0,
          width: "40vw",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={handleIconTap}
          aria-label="О художнице"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            padding: 0,
            pointerEvents: "auto",
          }}
        >
          <Image
            src="/mainpage/mainpage-icon-mobile2.png"
            alt="О художнице"
            width={400}
            height={600}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              objectPosition: "left bottom",
              filter: "brightness(1.1)",
              display: "block",
            }}
            unoptimized
          />
        </button>
      </div>
    </div>
  );
}
