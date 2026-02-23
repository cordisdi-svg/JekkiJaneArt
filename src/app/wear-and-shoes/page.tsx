// Wear and shoes painting page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function WearAndShoesPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold lg:text-3xl">Создание дизайнерского облика для вашей одежды и обуви</h1>
        <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="order-2 overflow-hidden rounded-xl border border-[var(--border)] lg:order-1">
            <Image src="/wear-and-shoes/1.png" alt="Роспись одежды и обуви, пример 1" width={900} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="order-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 text-sm leading-6 lg:order-2 lg:text-base">
            Я создаю индивидуальную роспись на одежде и обуви: от аккуратных акцентов до ярких авторских композиций.
            Работа начинается с вашей идеи, после чего мы согласуем эскиз, палитру и детали. В результате вы получаете
            уникальную вещь, которая подчёркивает ваш стиль и сохраняет свою выразительность в повседневной носке.
          </div>
          <div className="order-3 overflow-hidden rounded-xl border border-[var(--border)]">
            <Image src="/wear-and-shoes/2.JPEG" alt="Роспись одежды и обуви, пример 2" width={900} height={1200} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
