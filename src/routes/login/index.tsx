import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { loginSchema } from "@/lib/validations/user"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { useSessionQuery } from "@/queries/use-session-query"
import { PageSpinner } from "@/components/page-spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import type { LoginSchema } from "@/lib/validations/user"

export default function Login() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginSchema) => {
      await api.post("/auth/login/admin", values)
    },
    onSuccess: () => window.location.replace("/"),
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => login(values))

  const { user } = useSessionQuery()

  if (user) {
    window.location.replace("/")
    return <PageSpinner />
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login to Bravt Admin</CardTitle>
          <CardDescription>
            Privately login to admin with a secret route!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="email"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        type="email"
                        placeholder="john@gmail.com"
                        {...field}
                      />
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
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
