import { useTicketMessageSocket } from "@/sockets/use-ticket-message-socket"
import { useTicketsSocket } from "@/sockets/use-tickets-socket"
import * as React from "react"
import { io } from "socket.io-client"

import type { Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
)

interface SocketProviderProps {
  children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socket = React.useMemo(
    () =>
      io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"]
      }),
    []
  )

  React.useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [socket])

  return <SocketContext value={{ socket }}>{children}</SocketContext>
}

export const useSocket = (): SocketContextType => {
  const context = React.useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export function Sockets() {
  useTicketMessageSocket()
  useTicketsSocket()
  return null
}
