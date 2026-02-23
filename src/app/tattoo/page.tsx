"use client";

// Tattoo sketches page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { useModal } from "@/components/modals/ModalProvider";

export default function TattooPage() {
  const { openModal } = useModal();

  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="grid gap-5 lg:grid-cols-2 lg:items-center">
        <div className="order-1 space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
          <h1 className="text-2xl font-semibold lg:text-3xl">Тату эскизы</h1>
          <p className="text-sm leading-6 lg:text-base">
            Разрабатываю авторские тату-эскизы под вашу идею и анатомию. Учитываю стиль, размер, место нанесения и
            индивидуальные предпочтения, чтобы эскиз был выразительным и удобным для дальнейшей работы мастера.
          </p>
          <button
            type="button"
            onClick={() => openModal("order")}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            начать работу над эскизом
          </button>
        </div>
        <div className="order-2 overflow-hidden rounded-xl border border-[var(--border)]">
          <Image src="/tattoo/1.png" alt="Пример тату-эскиза" width={1000} height={1300} className="h-full w-full object-cover" />
        </div>
      </section>
    </PageBackground>
  );
}
