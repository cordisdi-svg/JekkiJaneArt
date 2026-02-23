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
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-md bg-white p-6"
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
