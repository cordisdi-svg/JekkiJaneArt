// Walls and furniture painting page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

const wallSections = [
  {
    image: "/walls/1.png",
    text: "Роспись стен и мебели превращает пространство в личную историю и задаёт характер интерьеру."
  },
  {
    image: "/walls/2.png",
    text: "Подбираю стиль и цветовую палитру под ваш интерьер, чтобы роспись выглядела цельно и современно."
  },
  {
    image: "/walls/3.png",
    text: "Работаю с квартирами, студиями, детскими комнатами, коммерческими и общественными пространствами."
  },
  {
    image: "/walls/4.png",
    text: "Использую материалы, рассчитанные на долговечность, с аккуратной проработкой деталей и линий."
  },
  {
    image: "/walls/5.jpg",
    text: "Перед стартом согласуем эскиз, размеры, сроки и бюджет, чтобы итог полностью соответствовал ожиданиям."
  }
];

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold lg:text-3xl">Создание уникального дизайна для вашего пространства</h1>
        <div className="space-y-4">
          {wallSections.map((item) => (
            <article key={item.image} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <Image src={item.image} alt="Пример росписи стен и мебели" width={1200} height={800} className="h-auto w-full rounded-lg object-cover" />
              </div>
              <p className="order-1 text-sm leading-6 lg:order-2 lg:text-base">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageBackground>
  );
}
