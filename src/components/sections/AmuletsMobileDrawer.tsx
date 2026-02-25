"use client";

import { useState } from "react";

export function AmuletsMobileDrawer({ onToggle }: { onToggle: (group: "men" | "women" | "pairs") => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 top-0 z-40 lg:hidden">
      <button className="w-full bg-black/50 py-2 text-white" onClick={() => setOpen((p) => !p)}>{open ? "Скрыть" : "Показать категории"}</button>
      {open ? (
        <div className="grid grid-cols-3 gap-1 bg-black/70 p-2 text-xs text-white">
          <button onClick={() => onToggle("men")}>для мужчин</button>
          <button onClick={() => onToggle("women")}>для женщин</button>
          <button onClick={() => onToggle("pairs")}>для пар</button>
        </div>
      ) : null}
    </div>
  );
}
