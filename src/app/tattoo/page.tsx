"use client";

import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { useModal } from "@/components/modals/ModalProvider";

export default function TattooPage() {
  const { openModal } = useModal();
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-4 px-4 py-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed lg:text-base">
          <p className="whitespace-pre-line">{`Индивидуальный эскиз татуировки по вашему запросу.

Процесс:

Обсуждение идеи и символики

Создание эскиза

Правки 

Финальный файл для мастера

Стоимость: от 2000 р

Работаю в авторском стиле, с учетом анатомии и места нанесения.`}</p>
          <button type="button" onClick={() => openModal("order")} className="mt-4 rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium">начать работу над эскизом</button>
        </div>
        <div className="max-h-[80vh] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
          <Image src="/tattoo/1.png" alt="Эскиз тату" width={900} height={1200} className="h-full max-h-[80vh] w-full object-contain" />
        </div>
      </section>
    </PageBackground>
  );
}
