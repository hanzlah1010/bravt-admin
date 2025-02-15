import { create } from "zustand"

type PlanModalStore = {
  open: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}

export const usePlanModal = create<PlanModalStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onOpenChange: (open) => set({ open })
}))
