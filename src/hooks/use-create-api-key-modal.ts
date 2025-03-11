import { create } from "zustand"

type ModalType = "VULTR" | "PAYMENT"

type CreateAPIKeyModalStore = {
  open: boolean
  modalType: ModalType
  onOpen: (type: ModalType) => void
  onOpenChange: (open: boolean) => void
}

export const useCreateAPIKeyModal = create<CreateAPIKeyModalStore>((set) => ({
  open: false,
  modalType: "VULTR",
  onOpen: (modalType) => set({ open: true, modalType }),
  onOpenChange: (open) => set({ open })
}))
