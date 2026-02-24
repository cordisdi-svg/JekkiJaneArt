import { PageBackground } from "@/components/layout/PageBackground";

export default function AvailablePage() {
  return (
    <PageBackground backgroundSrc="/availablepics/back-full.png">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-semibold">Готовые работы</h1>
        <p className="rounded-lg bg-[var(--card-bg)] px-4 py-2">Карусель будет добавлена на следующем шаге.</p>
      </section>
    </PageBackground>
  );
}
