import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function WearAndShoesPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <h1 className="text-center text-2xl font-semibold lg:text-3xl">Создание дизайнерского облика для вашей одежды и обуви</h1>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          <div className="order-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] lg:order-1">
            <Image src="/wear-and-shoes/1.png" alt="Роспись одежды" width={700} height={700} className="h-full w-full object-cover" />
          </div>
          <div className="order-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed lg:order-2 lg:text-base">
            Индивидуальная художественная роспись: джинсовок, худи, футболок, кед, обуви. Каждая вещь превращается в уникальный
            арт-объект. Стоимость: от 5 000 за изделие (зависит от сложности рисунка)
          </div>
          <div className="order-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
            <Image src="/wear-and-shoes/2.JPEG" alt="Роспись обуви" width={700} height={700} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
