import { create } from "zustand"

type CreateGlobalSnapshotModalStore = {
  open: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}

export const useCreateGlobalSnapshotModal =
  create<CreateGlobalSnapshotModalStore>((set) => ({
    open: false,
    onOpen: () => set({ open: true }),
    onOpenChange: (open) => set({ open })
  }))
