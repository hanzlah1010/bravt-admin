import * as React from "react"
import { io } from "socket.io-client"

import { useTicketsSocket } from "@/sockets/use-tickets-socket"
import { useTicketMessageSocket } from "@/sockets/use-ticket-message-socket"

import type { Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
)

interface SocketProviderProps {
  children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = React.useState(false)

  const socket = React.useMemo(
    () =>
      io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"]
      }),
    []
  )

  React.useEffect(() => {
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    socket.connect()
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)

    return () => {
      socket.disconnect()
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [socket])

  return (
    <SocketContext value={{ socket, isConnected }}>{children}</SocketContext>
  )
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
