import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { formatDate } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { UsersSelect } from "./users-select"
import { createNotificationSchema } from "@/lib/validations/notification"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import type { CreateNotificationSchema } from "@/lib/validations/notification"

export function CreateNotificationForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      sentToAll: "CURRENT"
    }
  })

  const { isPending, mutate: createNotification } = useMutation({
    mutationFn: async (values: CreateNotificationSchema) => {
      await api.post("/admin/notifications", values)
    },
    onSuccess: () => {
      navigate("/notifications")
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => createNotification(values))

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="title"
          disabled={isPending}
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
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className="h-[120px]"
                  placeholder="Enter your message..."
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
              <FormDescription>
                This notification will disappear after selected date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs
          defaultValue={"CURRENT"}
          onValueChange={(value) => {
            if (value === "SPECIFIC") {
              form.setValue("sentToAll", undefined)
              form.setValue("userIds", [])
            } else {
              form.setValue("sentToAll", value as "CURRENT" | "ALL_TIME")
              form.setValue("userIds", undefined)
            }
          }}
        >
          <FormField
            control={form.control}
            name="sentToAll"
            disabled={isPending}
            render={() => (
              <FormItem>
                <FormControl>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger disabled={isPending} value="CURRENT">
                      Current Users
                    </TabsTrigger>
                    <TabsTrigger disabled={isPending} value="ALL_TIME">
                      All time users
                    </TabsTrigger>
                    <TabsTrigger disabled={isPending} value="SPECIFIC">
                      Specific users
                    </TabsTrigger>
                  </TabsList>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <TabsContent
            value="CURRENT"
            className="text-sm text-muted-foreground"
          >
            All the current users can access this notification
          </TabsContent>

          <TabsContent
            value="ALL_TIME"
            className="text-sm text-muted-foreground"
          >
            All the current & upcoming users can access this notifcation
          </TabsContent>

          <TabsContent value="SPECIFIC">
            <FormField
              control={form.control}
              name="userIds"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Users</FormLabel>
                  <UsersSelect field={field} disabled={isPending} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full" loading={isPending}>
          Create
        </Button>
      </form>
    </Form>
  )
}
