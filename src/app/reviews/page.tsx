// Reviews page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function ReviewsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Отзывы</h1>
        <div className="flex flex-col gap-4 lg:flex-row">
          <article className="mx-auto flex w-[90vw] max-w-[340px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] lg:mx-0 lg:h-[340px] lg:w-[340px]">
            <div className="flex-1 p-4 text-sm leading-6">
              Здесь размещаются:
              <br />
              <br />
              текстовые отзывы
              <br />
              <br />
              фото клиентов с работами
              <br />
              <br />
              отзывы о росписи
              <br />
              <br />
              отзывы о портретах
            </div>
            <div className="relative flex-1">
              <Image
                src="/reweivs/b8f48cb5-13c0-4ae2-a08a-30801e5e5c88.png"
                alt="Пример клиентского отзыва"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 340px"
              />
            </div>
          </article>

          <article className="mx-auto flex aspect-square w-[90vw] max-w-[340px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] lg:mx-0 lg:h-[340px] lg:w-[340px]">
            <div className="flex flex-col items-center gap-3 text-center text-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-2xl">+</span>
              <span>добавить отзыв</span>
            </div>
          </article>
        </div>
      </section>
    </PageBackground>
  );
}
