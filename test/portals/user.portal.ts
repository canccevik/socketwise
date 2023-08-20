import { Socket } from 'socket.io'
import { ConnectedSocket, EmitOnSuccess, OnConnect, Portal, SubscribeMessage } from '../../src'

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

  @SubscribeMessage('emit_success')
  @EmitOnSuccess('sucess_emitted')
  public emitSuccess(): string {
    return 'success'
  }
}
