"use client";

import Image from "next/image";

export type AmuletsItem = { id: string; src: string; alt: string; group?: "men" | "women" | "pairs" };

export function AmuletsFeed({ items }: { items: AmuletsItem[] }) {
  return (
    <div className="space-y-4 px-2 py-4">
      {items.map((item) => (
        <article key={item.id} className="relative h-[90vh] overflow-hidden rounded-xl">
          <Image src={item.src} alt="" fill className="scale-110 object-cover blur-3xl" aria-hidden  unoptimized />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[90%] w-[min(92vw,680px)]">
              <Image src={item.src} alt={item.alt} fill className="object-contain"  unoptimized />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
