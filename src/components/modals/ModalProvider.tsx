"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import dynamic from "next/dynamic";

const OrderModalContent = dynamic(() => import("@/components/modals/OrderModalContent").then(mod => ({ default: mod.OrderModalContent })), { ssr: false });
const CertificatesModalContent = dynamic(() => import("@/components/modals/CertificatesModalContent").then(mod => ({ default: mod.CertificatesModalContent })), { ssr: false });
const SiteCreatorModalContent = dynamic(() => import("@/components/modals/SiteCreatorModalContent").then(mod => ({ default: mod.SiteCreatorModalContent })), { ssr: false });

type ModalType = "order" | "certificates" | "siteCreator";

type ModalContextValue = {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const modalContent: Record<ModalType, React.ReactNode> = {
  order: <OrderModalContent />,
  certificates: <CertificatesModalContent />,
  siteCreator: <SiteCreatorModalContent />
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const value = useMemo(
    () => ({
      activeModal,
      openModal: (modal: ModalType) => setActiveModal(modal),
      closeModal: () => setActiveModal(null)
    }),
    [activeModal]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <BaseModal isOpen={Boolean(activeModal)} onClose={value.closeModal} modalType={activeModal || undefined}>
        {activeModal ? modalContent[activeModal] : null}
      </BaseModal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}
