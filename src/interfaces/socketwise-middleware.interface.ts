import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

export interface SocketwiseMiddleware {
  use(socket: Socket, next: (err?: ExtendedError) => void): void
}
