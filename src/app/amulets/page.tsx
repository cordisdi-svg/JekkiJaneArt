"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useModal } from "@/components/modals/ModalProvider";
import { AmuletsDesktopControls } from "@/components/sections/AmuletsDesktopControls";
import { AmuletsFeed } from "@/components/sections/AmuletsFeed";
import { AmuletsMobileDrawer } from "@/components/sections/AmuletsMobileDrawer";
import { amuletsPics } from "@/data/amuletsPics";

export default function AmuletsPage() {
  const { openModal } = useModal();
  const [openGroup, setOpenGroup] = useState<"men" | "women" | "pairs" | null>(null);

  const feedItems = useMemo(() => {
    const extra = openGroup ? amuletsPics.groups[openGroup].map((item) => ({ ...item, group: openGroup })) : [];
    return [...extra, ...amuletsPics.base];
  }, [openGroup]);

  return (
    <section className="relative min-h-screen">
      <AmuletsMobileDrawer onToggle={(group) => setOpenGroup((prev) => (prev === group ? null : group))} />
      <AmuletsDesktopControls onToggle={(group) => setOpenGroup((prev) => (prev === group ? null : group))} onOrder={() => openModal("order")} />
      <motion.div key={openGroup ?? "base"} initial={{ opacity: 0.65, scaleY: 0.98 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 0.35 }}>
        <AmuletsFeed items={feedItems} />
      </motion.div>
    </section>
  );
}
