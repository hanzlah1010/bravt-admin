import { useQueryState } from "nuqs"
import { useState, useEffect } from "react"

export function useDebouncedQueryState(key: string, delay: number = 300) {
  const [state, setState] = useState("")
  const [debouncedState, setDebouncedState] = useQueryState(key, {
    defaultValue: ""
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(state)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [state, delay, setDebouncedState])

  return [state, setState, debouncedState] as const
}
