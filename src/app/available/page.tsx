// Available works page
import { PageBackground } from "@/components/layout/PageBackground";

export default function AvailablePage() {
  return (
    <PageBackground backgroundSrc="/availablepics/back-full.png">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Готовые работы</h1>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">Карусель будет добавлена на следующем шаге.</div>
      </section>
    </PageBackground>
  );
}
