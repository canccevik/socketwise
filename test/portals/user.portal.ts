import { Socket } from 'socket.io'
import { ConnectedSocket, OnConnect, Portal, SubscribeMessage } from '../../src'

@Portal('/users/:id')
export class UserPortal {
  @OnConnect()
  public onConnect(@ConnectedSocket() socket: Socket): void {
    socket.emit('connected')
  }

  @SubscribeMessage('new_user')
  public onMessage(@ConnectedSocket() socket: Socket): void {
    socket.emit('user_message')
  }
}
