import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
  autoConnect: false,
  path: '/socket.io'
})

export default socket