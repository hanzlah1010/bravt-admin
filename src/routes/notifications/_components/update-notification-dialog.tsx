import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatDate } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { updateNotificationSchema } from "@/lib/validations/notification"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import type { NotificationWithCount } from "@/queries/use-notifications-query"
import type { UpdateNotificationSchema } from "@/lib/validations/notification"

type UpdateNotificationDialogProps = {
  open: boolean
  onOpenChange: () => void
  notification?: NotificationWithCount
}

export default function UpdateNotificationDialog({
  open,
  onOpenChange,
  notification
}: UpdateNotificationDialogProps) {
  const queryClient = useQueryClient()

  const defaultValues = notification
    ? {
        title: notification?.title,
        message: notification?.message,
        validTill: notification ? new Date(notification?.validTill) : undefined
      }
    : {}

  const form = useForm<UpdateNotificationSchema>({
    resolver: zodResolver(updateNotificationSchema),
    defaultValues
  })

  const { isPending, mutate: updateNotification } = useMutation({
    mutationFn: async (values: UpdateNotificationSchema) => {
      if (!notification) return
      await api.patch(`/admin/notifications/${notification.id}`, values)
    },
    onSuccess: () => {
      onOpenChange()
      toast.success("Notification updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateNotification(values))

  useEffect(() => {
    if (notification) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Notification </DialogTitle>
          <DialogDescription>
            Update Notification{" "}
            <span className="font-medium">{notification?.title}</span>!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      placeholder="Enter your message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validTill"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Valid Till</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger
                        className={cn(
                          "flex h-10 w-full items-center justify-between rounded-md border-2 border-input px-3 py-1 focus-visible:border-primary focus-visible:outline-none data-[state=open]:border-primary md:text-sm",
                          { "text-muted-foreground/50": !field.value }
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-3 opacity-50" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isPending}
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
