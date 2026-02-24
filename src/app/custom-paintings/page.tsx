import { PageBackground } from "@/components/layout/PageBackground";

export default function CustomPaintingsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 lg:py-12">
        <h1 className="text-center text-3xl font-semibold">Картины на заказ</h1>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">Аккордеон будет добавлен на следующем шаге.</div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">Карусель будет добавлена на следующем шаге.</div>
        </div>
      </section>
    </PageBackground>
  );
}
