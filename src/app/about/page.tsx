// About the artist page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function AboutPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="space-y-6">
        <h1 className="text-center text-3xl font-semibold tracking-wide">JEKKI JANE</h1>
        <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <Image src="/about/person2.png" alt="Художница Jekki Jane, портрет слева" width={900} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 text-sm leading-6 lg:text-base">
            Привет! Я Jekki Jane — художница, которая работает на стыке живописи, росписи и авторских эскизов. Для
            меня важно, чтобы каждая работа отражала характер человека и пространства, для которого она создаётся.
            Люблю детали, чистую композицию и живой цвет. В проектах ценю открытый диалог, точность и бережное
            отношение к каждой идее.
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <Image src="/about/person1.png" alt="Художница Jekki Jane, портрет справа" width={900} height={1200} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
