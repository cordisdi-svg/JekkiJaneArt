"use client";

export function AmuletsDesktopControls({ onToggle, onOrder }: { onToggle: (group: "men" | "women" | "pairs") => void; onOrder: () => void }) {
  return (
    <>
      <div className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 gap-4 lg:flex lg:flex-col">
        <button onClick={() => onToggle("men")} className="h-24 w-24 rounded-full bg-white/85 text-xs">для мужчин</button>
        <button onClick={() => onToggle("women")} className="h-24 w-24 rounded-full bg-white/85 text-xs">для женщин</button>
        <button onClick={() => onToggle("pairs")} className="h-24 w-24 rounded-full bg-white/85 text-xs">для пар</button>
      </div>
      <button onClick={onOrder} className="fixed left-5 top-1/2 z-30 hidden h-28 w-28 -translate-y-1/2 animate-pulse rounded-full bg-white/90 p-4 text-xs lg:block">
        начать работу над моим талисманом
      </button>
    </>
  );
}
