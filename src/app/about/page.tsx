"use client";

import { useRef } from "react";
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { TypewriterText } from "@/components/ui/TypewriterText";

// ─── Typewriter text ──────────────────────────────────────────────────────────
const TYPEWRITER_TEXT =
  `За плечами — богатый опыт создания:

  •  уникальных композиций
  •  интерьерных картин
  •  портретов
  •  росписи стен
  •  оформления одежды и обуви
  •  индивидуальных эскизов тату


Стиль JEKKI JANE —
это сочетание эмоциональной глубины,
выразительности и современного
художественного языка.


Каждая работа — не просто изображение,
а живое состояние.

Это настроение, которое можно почувствовать.
Картины создаются с вниманием к человеку,
его истории и пространству,
в котором они будут находиться.`;


// ─── Typewriter component ─────────────────────────────────────────────────────
function TypewriterBox({
  text,
  fontSize = "clamp(13px, 1.35vw, 17px)",
}: {
  text: string;
  fontSize?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      style={{
        overflowY: "auto",
        height: "100%",
        width: "100%",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.18) transparent",
      }}
    >
      <div
        style={{
          fontFamily: "'IndiKazka', cursive",
          fontSize,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.92)",
          whiteSpace: "pre-wrap",
          margin: 0,
        }}
      >
        <TypewriterText scrollRef={scrollRef} delay={25}>
          {text}
        </TypewriterText>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <PageBackground backgroundSrc="/back-blur.webp">

      {/* ══════════════════ DESKTOP ══════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: "100%",
          height: "100svh",
          paddingBottom: "var(--nav-height-desktop)",
          overflow: "hidden",
        }}
      >
        {/* LEFT COLUMN ≈ 63% */}
        <div
          style={{
            width: "63%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "16px 0 0 16px", // no bottom padding — person2 flush to nav
            gap: "10px",
            boxSizing: "border-box",
          }}
        >
          {/* ── ROW 1: Box1 (title+subtitle) + Box2 (description), same height ── */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexShrink: 0,
              alignItems: "stretch",
            }}
          >
            {/* Box 1: JEKKI JANE + subtitle below, left-aligned, no background */}
            <div
              style={{
                flexShrink: 0,
                padding: "6px 14px 6px 4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'NegritaPro', sans-serif",
                  fontSize: "clamp(40px, 5.6vw, 72px)",
                  color: "#fff",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textShadow: "2px 3px 14px rgba(0,0,0,0.85)",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                JEKKI JANE
              </span>
              <span
                style={{
                  fontFamily: "'NegritaPro', sans-serif",
                  fontSize: "clamp(13px, 1.7vw, 22px)",
                  color: "rgba(255,255,255,0.88)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  textShadow: "1px 2px 8px rgba(0,0,0,0.8)",
                  lineHeight: 1.25,
                  display: "block",
                  marginTop: "6px",
                }}
              >
                художница
                <br />
                с авторским стилем
              </span>
            </div>

            {/* Box 2: description, left-aligned, RavenholmBold, slightly bigger, no background */}
            <div
              style={{
                flex: 1,
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'RavenholmBold', serif",
                  fontSize: "clamp(16px, 1.85vw, 24px)",
                  color: "rgba(255,255,255,0.90)",
                  margin: 0,
                  lineHeight: 1.55,
                  textShadow: "1px 2px 8px rgba(0,0,0,0.8)",
                  textAlign: "left",
                }}
              >
                современная художница с ярко выраженной<br />
                индивидуальной эстетикой, для которой искусство —<br />
                не просто увлечение, а способ чувствовать мир<br />
                и передавать эмоции через цвет и форму
              </p>
            </div>
          </div>

          {/* ── ROW 2: person2 (wider, flush to nav) + box3 (narrower) ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: "10px",
              minHeight: 0,
            }}
          >
            {/* person2: top = end of row1, bottom = nav, no border */}
            <div
              style={{
                flexShrink: 0,
                width: "clamp(200px, 30vw, 370px)",
                height: "100%",
                overflow: "hidden",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Image
                src="/about/person2.png"
                alt="Jekki Jane"
                width={370}
                height={560}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
               unoptimized />
            </div>

            {/* Box 3: typewriter, narrower, IndiKazka */}
            <div
              style={{
                flex: 1,
                background: "rgba(40, 10, 15, 0.65)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px", // rounded on all corners
                border: "1px solid rgba(220, 60, 60, 0.35)",
                padding: "16px 18px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px", // Gap from Nav
              }}
            >
              <TypewriterBox text={TYPEWRITER_TEXT} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN ≈ 37% — person1 */}
        <div
          style={{
            width: "37%",
            height: "100%",
            position: "relative",
            padding: "12px 12px 0 10px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "14px 14px 0 0",
              overflow: "hidden",
            }}
          >
            <Image
              src="/about/person1.png"
              alt="Jekki Jane portrait"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "top center" }}
             unoptimized />
          </div>
        </div>
      </div>

      {/* ══════════════════ MOBILE ══════════════════ */}
      <div
        className="flex flex-col lg:hidden"
        style={{
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          paddingTop: "10px",
          paddingBottom: "var(--nav-height-mobile)",
          gap: "6px",
          boxSizing: "border-box",
        }}
      >
        {/* Box 1: JEKKI JANE (top line) + subtitle (bottom line), centered, no dash */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2px 12px",
          }}
        >
          {/*
            Target: both lines visually same width.
            "JEKKI JANE" ≈ 10 chars → large font
            "художница с авторским стилем" ≈ 30 chars → ~1/3 size
            Tuned: 9.2vw vs 3.15vw
          */}
          <span
            style={{
              fontFamily: "'NegritaPro', sans-serif",
              fontSize: "clamp(28px, 9.2vw, 50px)",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textShadow: "2px 3px 12px rgba(0,0,0,0.85)",
              lineHeight: 1,
              display: "block",
              textAlign: "center",
            }}
          >
            JEKKI JANE
          </span>
          <span
            style={{
              fontFamily: "'NegritaPro', sans-serif",
              fontSize: "clamp(10px, 3.15vw, 17px)",
              color: "rgba(255,255,255,0.88)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textShadow: "1px 2px 8px rgba(0,0,0,0.8)",
              lineHeight: 1.2,
              display: "block",
              textAlign: "center",
              marginTop: "3px",
            }}
          >
            художница с авторским стилем
          </span>
        </div>

        {/* Box 2: RavenholmBold, centered, full width, bigger font */}
        <div
          style={{
            flexShrink: 0,
            width: "100%",
            padding: "2px 12px",
            textAlign: "justify", // Justify per user request
          }}
        >
          <p
            style={{
              fontFamily: "'RavenholmBold', serif",
              fontSize: "clamp(15px, 4.2vw, 21px)", // Increased
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              lineHeight: 1.45,
              textShadow: "1px 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            современная художница с ярко выраженной индивидуальной эстетикой,&nbsp;
            для которой искусство — не просто увлечение, а способ чувствовать мир&nbsp;
            и передавать эмоции через цвет и форму
          </p>
        </div>

        {/* Bottom row: typewriter left half | person1 right half, both flush to nav */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Typewriter — left 44% */}
          <div
            style={{
              width: "calc(44% - 6px)",
              background: "rgba(40, 10, 15, 0.65)", // Dark Red
              backdropFilter: "blur(12px)",
              borderRadius: "10px",
              border: "1px solid rgba(220, 60, 60, 0.35)",
              padding: "12px",
              margin: "0 0 6px 6px", // No right margin to remove gap
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TypewriterBox
              text={TYPEWRITER_TEXT}
              fontSize="clamp(10px, 2.6vw, 13px)"
            />
          </div>

          {/* person1 — right 56%, flush to nav */}
          <div
            style={{
              width: "56%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src="/about/person1.png"
              alt="Jekki Jane portrait"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "top center" }}
             unoptimized />
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
