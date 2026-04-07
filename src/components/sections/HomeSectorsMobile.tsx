"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HomeSectorsMobile.module.css";

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
  imagePos?: string; // object-position
  subLayoutType: "icon-adjacent" | "floating-high"; // для 1-3 и 4-6
  subBottom?: string; // для 4-6
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeSectorsMobile() {
  const router = useRouter();

  // Random picks are stable for the lifetime of this component instance
  const slides: Slide[] = useMemo(() => [
    { id: 1, imageSrc: pickRandom(AVAILABLE_POOL), heading: "Доступные\nкартины",  sub: "просто\nвыбери\nи закажи",                           href: "/available",     uniqueKey: '1', subLayoutType: "icon-adjacent" }, // imagePos вычисляется динамически
    { id: 2, imageSrc: "/walls/1.webp",             heading: "Создание\nна заказ", sub: "опиши\nсвою идею\nи я\nвоплощу\nеё",                 href: "/picstoorder",   uniqueKey: '2', imagePos: "85% center", subLayoutType: "icon-adjacent" },
    { id: 3, imageSrc: "/walls/3.webp",             heading: "Интерьеры",          sub: "сделаю\nпространство\nуникальным\nобъектом",        href: "/walls",         uniqueKey: '3', imagePos: "15% center", subLayoutType: "icon-adjacent" },
    { id: 4, imageSrc: "/amulets/mobile-main.webp", heading: "Картины\nталисманы", sub: "Создам твой личный проводник\nэнергии и намерений", href: "/amulets",       uniqueKey: '4', subLayoutType: "floating-high", subBottom: "60%" },
    { id: 5, imageSrc: pickRandom(WEAR_POOL),       heading: "Роспись\nодежды",    sub: "Сделаю твой образ\nнеповторимым",                   href: "/wear-and-shoes",uniqueKey: '5', subLayoutType: "floating-high", subBottom: "70%" },
    { id: 6, imageSrc: "/tattoo/1-mobile.webp",     heading: "Тату\nэскизы",       sub: "Разработаю дизайн\nтвоей татуировки",               href: "/tattoo",        uniqueKey: '6', subLayoutType: "floating-high", subBottom: "50%" },
    { id: 7, imageSrc: "/mainpage/mainpage-back.webp", heading: "",                sub: "",                                                 href: null,             uniqueKey: '7', subLayoutType: "floating-high" },
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
  const [imageMode, setImageMode] = useState<"zoom" | "exit">("zoom");
  
  const isAnimating = useRef(false);
  const exitedRef = useRef(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startY = useRef(0);
  const startX = useRef(0);

  // Сброс состояния выхода при переключении слайда
  useEffect(() => {
    exitedRef.current = false;
    setImageMode("zoom");
  }, [currentIndex]);

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
  const startExitAnimation = useCallback((href: string) => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setImageMode("exit");

    const go = () => {
      clearTimeout(timerRef.current);
      router.push(href);
    };

    const el = imageWrapperRef.current;
    if (el) {
      el.addEventListener("transitionend", go, { once: true });
      timerRef.current = setTimeout(go, 500); // safety fallback
    } else {
      setTimeout(go, 400);
    }
  }, [router]);

  const handleTap = useCallback((slide: Slide) => {
    if (!slide.href || exitedRef.current) return;
    startExitAnimation(slide.href);
  }, [startExitAnimation]);

  const handleIconTap = useCallback(() => {
    if (exitedRef.current) return;
    router.push("/about");
  }, [router]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    // Fixed wrapper NO transform, touch-action: none to prevent native pull-to-refresh
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 10, touchAction: "none", overscrollBehavior: "none" }}
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
          
          let dynamicImagePos = slide.imagePos;
          if (slide.id === 1 && slide.imageSrc.includes("back1.webp")) {
            dynamicImagePos = "85% center";
          }
          
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
              {/* Image Wrapper to handle scale without conflicting transitions */}
              <div
                ref={currentIndex === i ? imageWrapperRef : undefined}
                className={`absolute inset-0 ${imageMode === "exit" && currentIndex === i ? styles.imageExit : styles.imageZoom}`}
              >
                <Image
                  key={slide.uniqueKey}
                  src={slide.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  style={dynamicImagePos ? { objectPosition: dynamicImagePos } : {}}
                  sizes="100vw"
                  unoptimized
                  priority={isPriority}
                />
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* Text Elements Wrapper for fading out collectively during exit */}
              <div className={imageMode === "exit" && currentIndex === i ? styles.textExit : ""}>
                {/* Heading */}
                {slide.heading && (
                <div className="absolute top-[5%] left-[5%] right-[5%] z-10">
                  <span className="block font-fontatica uppercase tracking-wide text-[#f5f2eb] whitespace-pre-line leading-[0.85]"
                    style={{ 
                      fontSize: "clamp(3.8rem, 16vw, 6rem)",
                      textShadow: "0 4px 18px rgba(0,0,0,0.95)"
                    }}>
                    {slide.heading}
                  </span>
                </div>
              )}

              {/* Subtitle - Layout variations */}
              {slide.sub && slide.subLayoutType === "icon-adjacent" && (
                <div className="absolute z-10 flex flex-col justify-center"
                  style={{ 
                    left: "58vw", 
                    bottom: "2%", 
                    right: "2%", 
                    height: "45vw" // привязка к примерной высоте иконки
                  }}>
                  <span className="block font-comfortaa-light text-left text-white whitespace-pre-line leading-[1.1]"
                    style={{ 
                      fontSize: "clamp(1.4rem, 6.5vw, 2.5rem)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)"
                    }}>
                    {slide.sub}
                  </span>
                </div>
              )}

              {slide.sub && slide.subLayoutType === "floating-high" && (
                <div className="absolute right-[5%] left-[10%] z-10"
                  style={{ bottom: slide.subBottom || "50%" }}>
                  <span className="block font-comfortaa-light text-right text-white whitespace-pre-line leading-[1.2]"
                    style={{ 
                      fontSize: "clamp(1.3rem, 5.5vw, 2.2rem)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)"
                    }}>
                    {slide.sub}
                  </span>
                </div>
              )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FloatingIcon SIBLING of SliderTrack */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          bottom: "2%", // небольшой гэп от низа
          left: 0,
          width: "61vw", // увеличено ещё на 10%
          zIndex: 20,
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
