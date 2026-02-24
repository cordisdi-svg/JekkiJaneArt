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
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded bg-white px-3 py-1">✕</button>
        <div className="grid h-[92vh] w-full max-w-6xl grid-cols-1 gap-3 rounded-xl bg-black/30 p-3 lg:grid-cols-[2fr_1fr]">
          <div className="relative">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
          <div className="rounded-xl border border-white/40 bg-white/85 p-4 text-sm">Панель с описанием и видео будет добавлена позже.</div>
        </div>
      </div>
    </div>
  );
}
