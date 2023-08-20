import { Socket } from 'socket.io'
import { Middleware, SocketIONextFunc, SocketwiseMiddleware } from '../../src'

@Middleware('/middleware')
export class CustomMiddleware implements SocketwiseMiddleware {
  public use(socket: Socket, next: SocketIONextFunc): void {
    socket.handshake.headers['set-cookie'] = ['packageName=socketwise']
    next()
  }
}
