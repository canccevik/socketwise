import { Socket, Server } from 'socket.io'
import {
  ConnectedSocket,
  Message,
  MessageAck,
  Portal,
  SocketIO,
  SocketId,
  SocketQueryParam,
  SubscribeMessage
} from '../../src'

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

  @SubscribeMessage('message_ack')
  public messageAck(@Message() message: unknown, @MessageAck() ack: Function): void {
    ack(message)
  }

  @SubscribeMessage('socket_query_param')
  public socketQueryParam(
    @ConnectedSocket() socket: Socket,
    @SocketQueryParam('packageName') packageName: string
  ): void {
    socket.emit('socket_query_param_response', packageName)
  }
}
