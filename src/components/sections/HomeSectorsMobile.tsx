"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { label: "Доступные картины", href: "/available", y: -140 },
  { label: "Роспись стен и мебели", href: "/walls", y: -84 },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", y: -28 },
  { label: "Картины на заказ", href: "/custom-paintings", y: 28 },
  { label: "Картины-талиманы", href: "/amulets", y: 84 },
  { label: "Тату эскизы", href: "/tattoo", y: 140 }
];

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const tap = (index: number, href: string) => {
    if (active !== null) return;
    setActive(index);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-var(--nav-height-mobile))] items-center lg:hidden">
      <div className="absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2">
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
      <div className="relative ml-14 h-[74vh] w-[calc(100vw-3.5rem)]">
        {items.map((item, index) => (
          <motion.button
            key={item.href}
            type="button"
            onClick={() => tap(index, item.href)}
            animate={{ opacity: active === null || active === index ? 1 : 0.28, scale: active === index ? 1.04 : 1 }}
            transition={{ duration: 1 }}
            className="absolute left-0 top-1/2 flex h-14 items-center rounded-r-full border-2 border-white/70 bg-white/10 px-4 text-left text-sm text-white"
            style={{
              width: "calc(100% - 0.25rem)",
              transform: `translateY(calc(-50% + ${item.y}px))`
            }}
          >
            <span className="max-w-[95%] leading-tight">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
