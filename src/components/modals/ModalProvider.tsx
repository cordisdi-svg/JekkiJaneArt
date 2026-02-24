"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { OrderModalContent } from "@/components/modals/OrderModalContent";
import { CertificatesModalContent } from "@/components/modals/CertificatesModalContent";
import { SiteCreatorModalContent } from "@/components/modals/SiteCreatorModalContent";

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
      <BaseModal isOpen={Boolean(activeModal)} onClose={value.closeModal}>
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
