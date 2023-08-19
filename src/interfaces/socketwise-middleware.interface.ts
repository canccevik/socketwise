import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

export interface SocketIONextFunc {
  (err?: ExtendedError): void
}

export interface SocketwiseMiddleware {
  use(socket: Socket, next: SocketIONextFunc): void
}
