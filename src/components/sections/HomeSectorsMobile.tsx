"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const rows = [
  { label: "Доступные картины", href: "/available" },
  { label: "Роспись стен и мебели", href: "/walls" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { label: "Картины на заказ", href: "/custom-paintings" },
  { label: "Картины-талисманы", href: "/amulets" },
  { label: "Тату эскизы", href: "/tattoo" }
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
    <section className="relative min-h-[calc(100vh-var(--nav-height-mobile))] overflow-hidden lg:hidden">
      <div className="relative grid h-[calc(100vh-var(--nav-height-mobile))] grid-rows-[12.5fr_12.5fr_21fr_21fr_12.5fr_12.5fr] px-2 py-2">
        <div className="pointer-events-none absolute left-0 top-1/2 aspect-square h-1/2 -translate-y-1/2">
          <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
        {rows.map((row, index) => {
          const middle = index === 2 || index === 3;
          return (
            <motion.button
              key={row.href}
              type="button"
              onClick={() => tap(index, row.href)}
              animate={{ opacity: active === null || active === index ? 1 : 0.28, scale: active === index ? 1.02 : 1 }}
              transition={{ duration: 1 }}
              className="my-1 rounded-r-2xl border border-white/70 bg-white/10 px-4 text-left text-sm text-white"
              style={{ marginLeft: middle ? "min(50vh,72vw)" : "0.25rem" }}
            >
              {row.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
