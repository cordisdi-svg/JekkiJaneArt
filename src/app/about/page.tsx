import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function AboutPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-8">
        <h1 className="text-center text-3xl font-semibold">JEKKI JANE</h1>
        <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
          <div className="order-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
            <Image src="/about/person2.png" alt="JEKKI JANE" width={700} height={900} className="h-full w-full object-cover" />
          </div>
          <div className="order-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed lg:text-base">
            Художница JEKKI JANE. Работаю на стыке живописи, росписи и персональных визуальных решений для людей и пространств.
            Создаю проекты, в которых искусство становится частью повседневной жизни: от стен и одежды до тату-эскизов и картин.
            Открыта к сотрудничеству и индивидуальным запросам.
          </div>
          <div className="order-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
            <Image src="/about/person1.png" alt="Портрет художницы" width={700} height={900} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
