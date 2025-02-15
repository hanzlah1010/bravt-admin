import { AxiosError } from "axios"
import { toast } from "sonner"

export function getErrorMessage(error: Error) {
  let message
  if (error instanceof AxiosError && error.response?.data.message) {
    message = error.response?.data.message
  } else {
    message = "Something went wrong, try again later"
  }

  return message
}

export function handleError(error: Error) {
  const message = getErrorMessage(error)
  toast.error(message)
}
