"use client";

import { useRouter, usePathname } from "next/navigation";
import { orderedRoutes } from "@/data/routes";
import { useModal } from "@/components/modals/ModalProvider";

function navButtonClass(isActive: boolean) {
  return `rounded border px-3 py-2 text-sm ${isActive ? "font-bold" : "font-normal"}`;
}

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModal();

  const currentIndex = orderedRoutes.findIndex((route) => route.path === pathname);

  const handlePrev = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const prevIndex = (safeIndex - 1 + orderedRoutes.length) % orderedRoutes.length;
    router.push(orderedRoutes[prevIndex].path);
  };

  const handleNext = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + 1) % orderedRoutes.length;
    router.push(orderedRoutes[nextIndex].path);
  };

  return (
    <nav className="fixed bottom-0 left-0 z-[100] w-full border-t bg-white" aria-label="Bottom navigation">
      <div className="hidden min-h-[var(--nav-height-desktop)] items-center justify-center gap-2 px-4 lg:flex">
        <button type="button" className={navButtonClass(false)} onClick={handlePrev} aria-label="Предыдущая страница">
          ArrowPrev
        </button>
        <button type="button" className={navButtonClass(pathname === "/")} onClick={() => router.push("/")}>
          На главную
        </button>
        <button type="button" className={navButtonClass(false)} onClick={() => openModal("siteCreator")}>
          Создатель сайта
        </button>
        <button type="button" className={navButtonClass(false)} onClick={() => openModal("order")}>
          Заказать
        </button>
        <button type="button" className={navButtonClass(pathname === "/reviews")} onClick={() => router.push("/reviews")}>
          Отзывы
        </button>
        <button type="button" className={navButtonClass(false)} onClick={() => openModal("certificates")}>
          Сертификаты
        </button>
        <button type="button" className={navButtonClass(false)} onClick={handleNext} aria-label="Следующая страница">
          ArrowNext
        </button>
      </div>

      <div
        className="flex min-h-[var(--nav-height-mobile)] flex-col justify-center gap-2 px-4 py-2 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={navButtonClass(false)} onClick={() => openModal("order")}>
            Заказать
          </button>
          <button type="button" className={navButtonClass(pathname === "/")} onClick={() => router.push("/")}>
            НА ГЛАВНУЮ
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" className={navButtonClass(false)} onClick={() => openModal("certificates")}>
            Сертификаты
          </button>
          <button type="button" className={navButtonClass(pathname === "/reviews")} onClick={() => router.push("/reviews")}>
            Отзывы
          </button>
          <button type="button" className={navButtonClass(false)} onClick={() => openModal("siteCreator")}>
            Создатель сайта
          </button>
        </div>
      </div>
    </nav>
  );
}
