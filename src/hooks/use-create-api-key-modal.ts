import { create } from "zustand"

type CreateAPIKeyModalStore = {
  open: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}

export const useCreateAPIKeyModal = create<CreateAPIKeyModalStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onOpenChange: (open) => set({ open })
}))
