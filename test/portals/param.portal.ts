import { Socket, Server } from 'socket.io'
import { IncomingMessage } from 'http'
import {
  ConnectedSocket,
  Message,
  MessageAck,
  NamespaceParam,
  NamespaceParams,
  Portal,
  SocketIO,
  SocketId,
  SocketQueryParam,
  SocketRequest,
  SocketRooms,
  SubscribeMessage
} from '../../src'

@Portal('/params/:id')
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

  @SubscribeMessage('socket_request')
  public socketRequest(
    @ConnectedSocket() socket: Socket,
    @SocketRequest() request: IncomingMessage
  ): void {
    socket.emit('socket_request_response', request instanceof IncomingMessage)
  }

  @SubscribeMessage('socket_rooms')
  public socketRooms(@ConnectedSocket() socket: Socket, @SocketRooms() rooms: Set<Object>): void {
    socket.emit('socket_rooms_response', rooms.has(socket.id))
  }

  @SubscribeMessage('namespace_params')
  public namespaceParams(
    @ConnectedSocket() socket: Socket,
    @NamespaceParams() params: Record<string, string>
  ): void {
    socket.emit('namespace_params_response', params)
  }

  @SubscribeMessage('namespace_param')
  public namespaceParam(@ConnectedSocket() socket: Socket, @NamespaceParam('id') id: string): void {
    socket.emit('namespace_param_response', id)
  }
}
