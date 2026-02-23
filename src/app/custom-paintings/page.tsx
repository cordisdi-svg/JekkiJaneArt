// Custom paintings page
import { PageBackground } from "@/components/layout/PageBackground";

export default function CustomPaintingsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Картина, созданная специально для вас</h1>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
            Окна-аккордеон будут добавлены на следующем шаге.
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
            Карусель будет добавлена на следующем шаге.
          </div>
        </div>
      </section>
    </PageBackground>
  );
}
