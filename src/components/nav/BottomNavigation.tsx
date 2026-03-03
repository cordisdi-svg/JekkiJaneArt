"use client";

import { useRouter, usePathname } from "next/navigation";
import { orderedRoutes } from "@/data/routes";
import { useModal } from "@/components/modals/ModalProvider";

function Triangle({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 fill-white" aria-hidden>
      {direction === "left" ? <path d="M13 3 5 10l8 7V3Z" /> : <path d="M7 3v14l8-7-8-7Z" />}
    </svg>
  );
}

function navCellClass(isActive: boolean) {
  return `h-full w-full border-l border-white/20 text-white transition-colors hover:bg-white/10 ${isActive ? "bg-white/15 font-semibold" : "font-normal"}`;
}

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModal();

  const currentIndex = orderedRoutes.findIndex((route) => route.path === pathname);
  const handlePrev = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    router.push(orderedRoutes[(safeIndex - 1 + orderedRoutes.length) % orderedRoutes.length].path);
  };
  const handleNext = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    router.push(orderedRoutes[(safeIndex + 1) % orderedRoutes.length].path);
  };

  return (
    <nav className="fixed bottom-0 left-0 z-[100] w-full" style={{ background: "rgba(30,22,40,0.72)", backdropFilter: "blur(14px) saturate(1.4)", WebkitBackdropFilter: "blur(14px) saturate(1.4)", borderTop: "1px solid rgba(255,255,255,0.12)" }} aria-label="Bottom navigation">
      <div className="hidden h-[var(--nav-height-desktop)] w-full lg:flex">
        <button type="button" className="flex h-full w-[5%] items-center justify-center border-r border-white/20" onClick={handlePrev} aria-label="Предыдущая страница">
          <Triangle direction="left" />
        </button>
        <button type="button" className={`${navCellClass(pathname === "/")} w-[16.25%]`} onClick={() => router.push("/")}>На главную</button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%]`} onClick={() => openModal("siteCreator")}>Создатель сайта</button>
        <button type="button" className={`${navCellClass(false)} w-[25%] text-base`} onClick={() => openModal("order")}>Заказать</button>
        <button type="button" className={`${navCellClass(pathname === "/reviews")} w-[16.25%]`} onClick={() => router.push("/reviews")}>Отзывы</button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] border-r border-white/20`} onClick={() => openModal("certificates")}>Сертификаты</button>
        <button type="button" className="flex h-full w-[5%] items-center justify-center" onClick={handleNext} aria-label="Следующая страница">
          <Triangle direction="right" />
        </button>
      </div>

      <div className="flex h-[var(--nav-height-mobile)] w-full flex-col lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid h-1/2 grid-cols-2">
          <button type="button" className={`${navCellClass(false)} border-t border-white/20`} onClick={() => openModal("order")}>Заказать</button>
          <button type="button" className={`${navCellClass(pathname === "/")} border-t border-white/20`} onClick={() => router.push("/")}>НА ГЛАВНУЮ</button>
        </div>
        <div className="grid h-1/2 grid-cols-3 border-t border-white/20">
          <button type="button" className={navCellClass(false)} onClick={() => openModal("certificates")}>Сертификаты</button>
          <button type="button" className={navCellClass(pathname === "/reviews")} onClick={() => router.push("/reviews")}>Отзывы</button>
          <button type="button" className={navCellClass(false)} onClick={() => openModal("siteCreator")}>Создатель сайта</button>
        </div>
      </div>
    </nav>
  );
}
