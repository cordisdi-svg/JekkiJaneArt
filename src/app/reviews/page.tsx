import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function ReviewsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Отзывы</h1>
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
          <article className="flex w-[90vw] max-w-[340px] aspect-square flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] lg:h-[340px] lg:w-[340px]">
            <div className="flex-1 p-4 text-sm">Спасибо за доверие и тёплую обратную связь. Ниже один из отзывов клиентов.</div>
            <div className="relative h-1/2 w-full">
              <Image
                src="/reweivs/b8f48cb5-13c0-4ae2-a08a-30801e5e5c88.png"
                alt="Отзыв клиента"
                fill
                className="object-cover"
              />
            </div>
          </article>
          <article className="flex w-[90vw] max-w-[340px] aspect-square items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-center lg:h-[340px] lg:w-[340px]">
            <div className="space-y-2">
              <div className="text-4xl leading-none">+</div>
              <p className="text-sm">добавить отзыв</p>
            </div>
          </article>
        </div>
      </section>
    </PageBackground>
  );
}
