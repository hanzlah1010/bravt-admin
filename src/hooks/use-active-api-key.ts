import { useCallback, useEffect, useMemo } from "react"
import { useSessionStorage } from "usehooks-ts"

import { useApiKeysQuery } from "@/queries/use-api-keys-query"

export function useActiveAPIKey() {
  const { data } = useApiKeysQuery(false)
  const [activeKeyId, setActiveKeyId, removeKeyId] = useSessionStorage(
    "active_key",
    data?.[0]?.id
  )

  const activeKey = useMemo(() => {
    const key = data?.find((key) => key.id === activeKeyId)
    if (!key && data?.[0]) {
      setActiveKeyId(data?.[0]?.id)
      return data?.[0]
    }

    return key
  }, [activeKeyId, data, setActiveKeyId])

  const setActiveKey = useCallback(
    (id: string) => {
      setActiveKeyId(id)
      window.location.reload()
    },
    [setActiveKeyId]
  )

  useEffect(() => {
    if (activeKey && !sessionStorage.getItem("active_key")) {
      setActiveKeyId(activeKey.id)
    }
  }, [activeKey, setActiveKeyId])

  useEffect(() => {
    if (activeKeyId && !data?.some((key) => key.id === activeKeyId)) {
      sessionStorage.removeItem("active_key")
      if (data?.[0]) setActiveKeyId(data[0].id)
    }
  }, [activeKeyId, data, setActiveKeyId])

  return { activeKey, setActiveKey, removeKeyId }
}
