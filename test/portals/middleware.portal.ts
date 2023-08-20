import { Socket } from 'socket.io'
import { OnConnect, Portal, ConnectedSocket } from '../../src'

@Portal('/middleware')
export class MiddlewarePortal {
  @OnConnect()
  public onConnect(@ConnectedSocket() socket: Socket): void {
    socket.emit('connected', socket.handshake.headers['set-cookie'])
  }
}
