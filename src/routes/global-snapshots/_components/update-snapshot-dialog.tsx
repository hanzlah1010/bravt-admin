import { useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlusIcon, UploadIcon, XIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { handleError } from "@/lib/error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateGlobalSnapshotSchema } from "@/lib/validations/snapshot"
import { PasswordInput } from "@/components/ui/password-input"
import { useSingleFileSelect } from "@/hooks/use-single-file-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import type { GlobalSnapshot } from "@/types/db"
import type { UpdateGlobalSnapshotSchema } from "@/lib/validations/snapshot"

type UpdateGlobalSnapshotDialogProps = {
  open: boolean
  onOpenChange: () => void
  snapshot?: GlobalSnapshot
}

export default function UpdateGlobalSnapshotDialog({
  open,
  onOpenChange,
  snapshot
}: UpdateGlobalSnapshotDialogProps) {
  const queryClient = useQueryClient()
  const defaultValues = {
    name: snapshot?.name ?? "",
    username: snapshot?.username ?? "",
    password: snapshot?.password ?? "",
    version: snapshot?.version ?? ""
  }

  const form = useForm<UpdateGlobalSnapshotSchema>({
    resolver: zodResolver(updateGlobalSnapshotSchema),
    defaultValues
  })

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: UpdateGlobalSnapshotSchema) => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => formData.set(key, value))
      if (selectedFile) formData.set("icon", selectedFile)
      else if (selectedFile === null) formData.set("icon", "")
      await api.patch(`/admin/global-snapshot/${snapshot?.id}`, formData)
    },
    onSuccess: () => {
      onOpenChange()
      queryClient.invalidateQueries({ queryKey: ["global-snapshots"] })
      toast.success("Global snapshot updated!")
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => update(values))
  const {
    isDragActive,
    getRootProps,
    getInputProps,
    selectedFile,
    setSelectedFile
  } = useSingleFileSelect(isPending)

  useEffect(() => {
    if (open) form.reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update {snapshot?.name} snapshot</DialogTitle>
          <DialogDescription>
            This will be shown to all users while deploying instance
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "group relative flex aspect-square size-20 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border-2 border-dashed transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "bg-input/30 text-muted-foreground",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                <input {...getInputProps()} />
                {selectedFile !== null ? (
                  <>
                    {selectedFile || snapshot?.iconUrl ? (
                      <>
                        <img
                          alt={selectedFile?.name || snapshot?.name}
                          src={selectedFile?.preview || snapshot?.iconUrl}
                          className="size-full rounded-md bg-muted object-cover object-center"
                        />
                        <div
                          className={cn(
                            "absolute z-10 flex size-full items-center justify-center overflow-hidden rounded-md bg-black/60 text-white/80 transition-opacity",
                            isDragActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <ImagePlusIcon className="size-5" />
                        </div>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="size-5" />
                        <p className="text-center text-sm">
                          {isDragActive ? "Drop" : "Upload"}
                        </p>
                      </>
                    )}

                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      aria-label="Remove image"
                      className="absolute -right-2 -top-2 z-20 size-5 rounded-full opacity-0 transition-opacity group-hover:opacity-100 [&_svg]:size-3.5"
                      onClick={(evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        setSelectedFile(null)
                      }}
                    >
                      <XIcon />
                    </Button>
                  </>
                ) : (
                  <>
                    <UploadIcon className="size-5" />
                    <p className="text-center text-sm">
                      {isDragActive ? "Drop" : "Upload"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OS Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Windows" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OS Version</FormLabel>
                  <FormControl>
                    <Input placeholder="2012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Administrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" loading={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
