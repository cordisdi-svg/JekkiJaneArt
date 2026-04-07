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
  uniqueKey: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeSectorsMobile() {
  const router = useRouter();

  // Random picks are stable for the lifetime of this component instance
  const slides = useMemo(() => [
    { id: 1, imageSrc: pickRandom(AVAILABLE_POOL), heading: "Доступные картины",  sub: "просто выбери и закажи",                           href: "/available"     },
    { id: 2, imageSrc: "/walls/1.webp",             heading: "Создание на заказ",  sub: "опиши свою идею и я воплощу её",                   href: "/picstoorder"   },
    { id: 3, imageSrc: "/walls/3.webp",             heading: "Интерьеры",          sub: "Сделаю твоё пространство уникальным арт-объектом", href: "/walls"         },
    { id: 4, imageSrc: "/amulets/mobile-main.webp", heading: "Картины-талисманы",  sub: "Создам твой личный проводник энергии и намерений", href: "/amulets"       },
    { id: 5, imageSrc: pickRandom(WEAR_POOL),       heading: "Роспись одежды",     sub: "Сделаю твой образ неповторимым",                   href: "/wear-and-shoes"},
    { id: 6, imageSrc: "/tattoo/1-mobile.webp",     heading: "Тату-эскизы",        sub: "Разработаю дизайн твоей татуировки",               href: "/tattoo"        },
    { id: 7, imageSrc: "/mainpage/mainpage-back.webp", heading: "",               sub: "",                                                 href: null             },
  ], []);

  const extendedSlides: Slide[] = useMemo(() => {
    if (slides.length === 0) return [];
    return [
      { ...slides[slides.length - 1], uniqueKey: 'clone-last' },
      ...slides.map(s => ({ ...s, uniqueKey: s.id.toString() })),
      { ...slides[0], uniqueKey: 'clone-first' }
    ];
  }, [slides]);

  const N = slides.length; // 7

  // ─── Slider state ───────────────────────────────────────────────────────────
  // index 1 corresponds to slide.id 1
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  
  const isAnimating = useRef(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);
  const startX = useRef(0);

  const startSlideTransition = useCallback((newIndex: number) => {
    isAnimating.current = true;
    setIsTransitionEnabled(true);
    setCurrentIndex(newIndex);
  }, []);

  // Handle bounds / Infinite seamless loop on transition end
  useEffect(() => {
    const track = sliderTrackRef.current;
    if (!track) return;

    const onTransitionEnd = () => {
      // Are we smoothly transitioned into a clone boundary?
      if (currentIndex === 0) {
        setIsTransitionEnabled(false);
        setCurrentIndex(N);
      } else if (currentIndex === N + 1) {
        setIsTransitionEnabled(false);
        setCurrentIndex(1);
      }
      isAnimating.current = false;
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [currentIndex, N]);

  // Safety fallback if transitionend doesn't fire
  useEffect(() => {
    if (!isTransitionEnabled || !isAnimating.current) return;
    const fallbackTimer = setTimeout(() => {
      if (currentIndex === 0) {
        setIsTransitionEnabled(false);
        setCurrentIndex(N);
      } else if (currentIndex === N + 1) {
        setIsTransitionEnabled(false);
        setCurrentIndex(1);
      }
      isAnimating.current = false;
    }, 600); // Wait 600ms (550 + 50 buffer)
    return () => clearTimeout(fallbackTimer);
  }, [currentIndex, isTransitionEnabled, N]);

  const handleSwipe = useCallback((direction: "up" | "down") => {
    if (direction === "up") {
      startSlideTransition(currentIndex + 1);
    } else {
      startSlideTransition(currentIndex - 1);
    }
  }, [currentIndex, startSlideTransition]);

  // ─── Touch handlers (passive touchstart) ────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy = startY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(startX.current - e.changedTouches[0].clientX);

    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return;
    if (isAnimating.current) return;

    handleSwipe(dy > 0 ? "up" : "down");
  }, [handleSwipe]);

  // ─── Tap handler ────────────────────────────────────────────────────────────
  const handleTap = useCallback((slide: Slide) => {
    if (!slide.href) return;
    console.log("Navigate to:", slide.href); // Step 4
  }, []);

  const handleIconTap = useCallback(() => {
    console.log("Navigate to: /about"); // Step 4
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    // Fixed wrapper NO transform
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 10 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* SliderTrack */}
      <div
        ref={sliderTrackRef}
        style={{
          position: "absolute",
          inset: 0,
          height: `${extendedSlides.length * 100}svh`,
          transform: `translateY(-${currentIndex * 100}svh)`,
          transition: isTransitionEnabled ? "transform 550ms cubic-bezier(0.77,0,0.175,1)" : "none",
        }}
      >
        {extendedSlides.map((slide, i) => {
          // For initial paint priority, optimize priority loading for the real first slide content
          const isPriority = slide.id === 1 && (i === 1 || i === extendedSlides.length - 1);
          
          return (
            <div
              key={slide.uniqueKey}
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
                priority={isPriority}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/25" />

              {/* Heading */}
              {slide.heading && (
                <div className="absolute top-[4%] left-[5%] right-[5%] z-10">
                  <span className="block font-fontatica uppercase tracking-wide text-[#f0ede6]"
                    style={{ fontSize: "clamp(1.9rem, 8.5vw, 2.6rem)" }}>
                    {slide.heading}
                  </span>
                </div>
              )}

              {/* Sub */}
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
          );
        })}
      </div>

      {/* FloatingIcon SIBLING of SliderTrack */}
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
