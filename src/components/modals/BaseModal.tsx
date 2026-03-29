"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalType?: string;
};

export function BaseModal({ isOpen, onClose, children, modalType }: BaseModalProps) {
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
    <div className="fixed inset-0 z-[1000]" onClick={onClose} role="presentation">
      <div className="absolute inset-0 bg-[var(--modal-bg)]" />
      <div className="relative flex h-full items-end justify-center p-0 lg:items-center lg:p-4">
        <div
          className={`w-full rounded-t-2xl bg-black/25 backdrop-blur-md border border-white/10 p-6 lg:max-w-lg lg:rounded-xl text-white/95 ${
            modalType === 'order' ? 'max-h-none overflow-hidden lg:overflow-y-auto' : 'max-h-[80vh] overflow-y-auto lg:max-h-none'
          }`}
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    portalTarget
  );
}
