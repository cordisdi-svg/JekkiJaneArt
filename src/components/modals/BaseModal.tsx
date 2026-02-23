"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BaseModal({ isOpen, onClose, children }: BaseModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const portalTarget = useMemo(() => (mounted ? document.body : null), [mounted]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-[var(--modal-bg)] p-0 lg:items-center lg:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--surface)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:max-h-[90vh] lg:max-w-lg lg:rounded-md lg:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalTarget
  );
}
