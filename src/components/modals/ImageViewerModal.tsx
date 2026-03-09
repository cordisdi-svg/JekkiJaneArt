"use client";

import Image from "next/image";
import { useEffect } from "react";

export function ImageViewerModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1100] bg-black/70 p-4" onClick={onClose} role="presentation">
      <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-black/40 backdrop-blur-md border border-white/10 p-2 text-white/90 hover:bg-black/60 transition-colors" aria-label="Закрыть">
          <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current"><path d="M15 5 5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
        <div className="grid h-[92vh] w-full max-w-6xl grid-cols-1 gap-3 rounded-xl bg-black/30 p-3 lg:grid-cols-[2fr_1fr]" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
          <div className="relative">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 backdrop-blur-md p-4 text-sm text-white/95 leading-relaxed">Панель с описанием и видео будет добавлена позже.</div>
        </div>
      </div>
    </div>
  );
}
