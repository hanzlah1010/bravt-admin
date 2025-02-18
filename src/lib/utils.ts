import qs from "qs"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { UseQueryStatesKeysMap, Values } from "nuqs"
import type { ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  amount: string | number,
  maxDecimals = 3,
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

export function formatBytesToGB(bytes: number) {
  if (!bytes) return "0 GB"
  return `${(bytes / 1024 ** 3).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} GB`
}
