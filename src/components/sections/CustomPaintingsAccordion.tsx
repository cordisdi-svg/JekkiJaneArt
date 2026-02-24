"use client";

import Image from "next/image";
import { useState } from "react";

const panes = [
  { title: "какие типы картин вы можете заказать", body: "Вы можете заказать интерьерные картины, символические полотна, подарочные работы и серии под пространство." },
  { title: "Как проходит работа", body: "Сначала обсуждаем задачу и референсы, затем подготавливаю концепцию и согласовываю с вами до финального старта." },
  { title: "Стоимость картин на заказ и сроки", body: "Цена зависит от формата и сложности. Сроки обычно от 7 дней, точный план согласуем после брифа." },
  { title: "Шпаргалка по размерам", body: "" }
];

export function CustomPaintingsAccordion() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);

  const clickPane = (index: number) => {
    if (index === 3) return setSizeOpen(true);
    setExpanded((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
        {expanded === null ? (
          <div className="grid h-full grid-rows-4">
            {panes.map((pane, i) => (
              <button key={pane.title} className="border-b border-[var(--border)] px-4 text-left" onClick={() => clickPane(i)}>{pane.title}</button>
            ))}
          </div>
        ) : (
          <>
            <button type="button" className="h-[85%] w-full p-4 text-left" onClick={() => setExpanded(null)}>
              <h3 className="mb-3 text-lg font-semibold">{panes[expanded].title}</h3>
              <p>{panes[expanded].body}</p>
            </button>
            <div className="grid h-[15%] grid-cols-3 border-t border-[var(--border)]">
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" onClick={() => setExpanded(i)} className="border-r border-[var(--border)] px-2 text-xs">
                  {panes[i].title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {sizeOpen ? (
        <div className="fixed inset-0 z-[1100] bg-black/70 p-4" onClick={() => setSizeOpen(false)} role="presentation">
          <div className="relative h-full w-full">
            <Image src="/picstoorder/sizes.png" alt="Шпаргалка размеров" fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
