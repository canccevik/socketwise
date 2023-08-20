import { Socket } from 'socket.io'
import { ConnectedSocket, Portal, SocketId, SubscribeMessage } from '../../src'

@Portal('/params')
export class ParamPortal {
  @SubscribeMessage('socket_id')
  public socketId(@SocketId() socketId: string, @ConnectedSocket() socket: Socket): void {
    socket.emit('socket_id_response', socketId)
  }
}
