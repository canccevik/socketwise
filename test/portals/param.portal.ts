import { Socket } from 'socket.io'
import { ConnectedSocket, Message, Portal, SocketIO, SocketId, SubscribeMessage } from '../../src'
import { Server } from 'socket.io'

@Portal('/params')
export class ParamPortal {
  @SubscribeMessage('connected_socket')
  public connectedSocket(@ConnectedSocket() socket: Socket): void {
    socket.emit('connected_socket_response', socket.id)
  }

  @SubscribeMessage('socket_id')
  public socketId(@SocketId() socketId: string, @ConnectedSocket() socket: Socket): void {
    socket.emit('socket_id_response', socketId)
  }

  @SubscribeMessage('socket_io')
  public socketIO(@SocketIO() socketIO: Server, @ConnectedSocket() socket: Socket): void {
    socket.emit('socket_io_response', socketIO instanceof Server)
  }

  @SubscribeMessage('message_decorator')
  public message(@Message() message: unknown, @ConnectedSocket() socket: Socket): void {
    socket.emit('message_decorator_response', message)
  }
}
