import { Socket } from 'socket.io'
import { ConnectedSocket, OnConnect, Portal } from '../../src'

@Portal('/users/:id')
export class UserPortal {
  @OnConnect()
  public onConnect(@ConnectedSocket() socket: Socket): void {
    socket.emit('connected')
  }
}
