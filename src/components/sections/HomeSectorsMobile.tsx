"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { label: "Доступные картины", href: "/available", angle: -65 },
  { label: "Роспись стен и мебели", href: "/walls", angle: -40 },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", angle: -15 },
  { label: "Картины на заказ", href: "/custom-paintings", angle: 15 },
  { label: "Картины-талиманы", href: "/amulets", angle: 40 },
  { label: "Тату эскизы", href: "/tattoo", angle: 65 }
];

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const onTap = (index: number, href: string) => {
    setActive(index);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-var(--nav-height-mobile))] items-center lg:hidden">
      <div className="absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2">
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
      <div className="relative ml-10 h-[70vh] w-[85vw]">
        {items.map((item, index) => {
          const r = 28 + index * 9;
          return (
            <motion.button
              key={item.href}
              type="button"
              onClick={() => onTap(index, item.href)}
              animate={{ opacity: active === null || active === index ? 1 : 0.3, scale: active === index ? 1.05 : 1 }}
              transition={{ duration: 1 }}
              className="absolute left-10 top-1/2 h-12 -translate-y-1/2 rounded-r-full border border-white/70 bg-black/35 px-4 text-left text-sm text-white"
              style={{
                width: `${r}vw`,
                transform: `translateY(-50%) rotate(${item.angle}deg)`,
                transformOrigin: "left center"
              }}
            >
              <span className="block">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
