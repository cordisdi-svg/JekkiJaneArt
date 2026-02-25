"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const panes = [
  { title: "какие типы картин вы можете заказать", body: "Вы можете заказать интерьерные картины, символические полотна, подарочные работы и серии под пространство." },
  { title: "Как проходит работа", body: "Сначала обсуждаем задачу и референсы, затем подготавливаю концепцию и согласовываю с вами до финального старта." },
  { title: "Стоимость картин на заказ и сроки", body: "Цена зависит от формата и сложности. Сроки обычно от 7 дней, точный план согласуем после брифа." },
  { title: "Шпаргалка по размерам", body: "" }
];

export function CustomPaintingsAccordion() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);

  useEffect(() => {
    if (!sizeOpen) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setSizeOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [sizeOpen]);

  const clickPane = (index: number) => {
    if (index === 3) return setSizeOpen(true);
    setExpanded((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <div className="h-full min-h-[420px] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2">
        {expanded === null ? (
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
            {panes.map((pane, i) => (
              <button key={pane.title} className="rounded-lg border border-[var(--border)] bg-white/60 p-3 text-left text-sm" onClick={() => clickPane(i)}>
                {pane.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <button type="button" className="h-[85%] rounded-lg bg-white/55 p-4 text-left" onClick={() => setExpanded(null)}>
              <h3 className="mb-3 text-lg font-semibold">{panes[expanded].title}</h3>
              <p>{panes[expanded].body}</p>
            </button>
            <div className="mt-2 grid h-[15%] grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" onClick={() => setExpanded(i)} className="rounded-lg border border-[var(--border)] bg-white/65 px-2 text-xs">
                  {panes[i].title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {sizeOpen ? (
        <div className="fixed inset-0 z-[1100] bg-black/70 p-4" onClick={() => setSizeOpen(false)} role="presentation">
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image src="/picstoorder/sizes.png" alt="Шпаргалка размеров" fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
