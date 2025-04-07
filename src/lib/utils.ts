import qs from "qs"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  format
} from "date-fns"

import type { UseQueryStatesKeysMap, Values } from "nuqs"
import type { ClassValue } from "clsx"
import type { User } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  amount: string | number,
  maxDecimals = 7,
  style: keyof Intl.NumberFormatOptionsStyleRegistry = "currency"
) {
  const amtNumber = Number(amount)
  if (isNaN(amtNumber)) return ""
  return new Intl.NumberFormat("en-US", {
    style,
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  }).format(amtNumber)
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}

export function encodeQueryParams(searchParams: Values<UseQueryStatesKeysMap>) {
  return qs.stringify(searchParams, {
    arrayFormat: "comma",
    encode: true,
    skipNulls: true,
    encodeValuesOnly: true,
    format: "RFC1738",
    filter: (_, value) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
          .join(",")
      }
      return value
    }
  })
}

export function getUserInitials(user: Partial<User>) {
  if (user.firstName) {
    return `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`.toUpperCase()
  } else {
    return user.email?.charAt(0).toUpperCase()
  }
}

export function formatMsgDate(date: Date) {
  const today = new Date()
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  if (differenceInCalendarDays(today, date) < 7) return format(date, "EEEE")
  return format(date, "dd/MM/yyyy")
}

export function isInstanceInstalling(instance: VultrInstance) {
  if (
    (instance?.server_status !== "ok" &&
      instance?.server_status !== "installingbooting") ||
    instance?.status !== "active" ||
    !["running", "stopped"].includes(instance?.power_status)
  ) {
    return true
  }
  return false
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${Number((bytes / Math.pow(1024, i)).toFixed(decimals))} ${sizes[i]}`
}
