import { Socket } from 'socket.io'
import { ConnectedSocket, Portal, SocketIO, SocketId, SubscribeMessage } from '../../src'
import { Server } from 'socket.io'

@Portal('/params')
export class ParamPortal {
  @SubscribeMessage('socket_id')
  public socketId(@SocketId() socketId: string, @ConnectedSocket() socket: Socket): void {
    socket.emit('socket_id_response', socketId)
  }

  @SubscribeMessage('socket_io')
  public socketIO(@SocketIO() socketIO: Server, @ConnectedSocket() socket: Socket): void {
    socket.emit('socket_io_response', socketIO instanceof Server)
  }
}
