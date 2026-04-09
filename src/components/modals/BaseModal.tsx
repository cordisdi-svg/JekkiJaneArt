"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalType?: string;
};

export function BaseModal({ isOpen, onClose, children, modalType }: BaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const [pullAmount, setPullAmount] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

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

  const onTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || !contentRef.current) return;
    const currentY = e.touches[0].clientY;
    const dy = currentY - startYRef.current;

    // Закрытие только если мы в самом верху контента
    if (contentRef.current.scrollTop <= 0 && dy > 0) {
      // Это стандартная блокировка pull-to-refresh от Google (prevent default на touchmove)
      if (e.cancelable) e.preventDefault();
      
      // Добавляем эффект сопротивления (резиновости)
      const resistance = dy > 150 ? 150 + (dy - 150) * 0.3 : dy;
      setPullAmount(resistance);
    } else {
      setPullAmount(0);
    }
  };

  const onTouchEnd = () => {
    if (pullAmount > 80) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
        setPullAmount(0);
      }, 200);
    } else {
      setPullAmount(0);
    }
    startYRef.current = null;
  };

  const portalTarget = useMemo(() => (mounted ? document.body : null), [mounted]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000]" onClick={onClose} role="presentation">
      <div className="absolute inset-0 bg-[var(--modal-bg)]" />
      <div 
        className="relative flex h-full items-end justify-center p-0 lg:items-center lg:p-4"
        style={{
          transition: pullAmount === 0 ? "transform 0.3s ease-out" : "none",
          transform: `translateY(${pullAmount}px)`,
          opacity: isClosing ? 0 : 1,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={contentRef}
          className={`w-full rounded-t-2xl bg-black/25 backdrop-blur-md border border-white/10 p-6 lg:max-w-lg lg:rounded-xl text-white/95 ${
            modalType === 'order' ? 'max-h-none overflow-hidden lg:overflow-y-auto' : 'max-h-[80vh] overflow-y-auto lg:max-h-none'
          }`}
          style={{ 
            fontFamily: "'Comfortaa', sans-serif",
            overscrollBehavior: "none",
            touchAction: "pan-x pan-y" 
          }}
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Визуальная ручка для мобилок */}
          <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-white/20 lg:hidden" aria-hidden />
          {children}
        </div>
      </div>
    </div>,
    portalTarget
  );
}
