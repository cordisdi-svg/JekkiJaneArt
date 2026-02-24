import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

const rows = [
  { image: "/walls/1.png", text: "Роспись стен для: квартир студий салонов кафе коммерческих пространств" },
  { image: "/walls/2.png", text: "Работа выполняется под стиль интерьера и задачи пространства, гармонично интегрируется в стиль помещения делая его художественно уникальным" },
  { image: "/walls/3.png", text: "Этапы: Выезд / обсуждение по фото, подготовка эскиза, утверждение, реализация" },
  { image: "/walls/4.png", text: "Стоимость: от 10 000 (финальная цена зависит от размера, сложности и объема работ)" },
  { image: "/walls/5.jpg", text: "Больше примеров работ по запросу" }
];

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-8">
        <h1 className="text-center text-2xl font-semibold lg:text-3xl">Создание уникального дизайна для вашего пространства</h1>
        {rows.map((row) => (
          <article key={row.image} className="grid gap-3 lg:grid-cols-2 lg:items-stretch">
            <div className="order-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed lg:text-base">{row.text}</div>
            <div className="order-2 max-h-[75vh] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <Image src={row.image} alt="Пример росписи" width={800} height={500} className="h-full max-h-[75vh] w-full object-contain" />
            </div>
          </article>
        ))}
      </section>
    </PageBackground>
  );
}
