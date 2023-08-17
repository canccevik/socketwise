import { Server, Socket } from 'socket.io'
import { Type } from './interfaces'
import { ActionStorage, ParamStorage } from './storages'
import { SocketEvent } from './enums'
import { Container } from 'magnodi'
import { ActionMetadata, ParamType } from './metadata'

export interface SocketwiseOptions {
  io?: Server
  port?: number
  portals: Type[]
}

export class Socketwise {
  public io: Server
  private portals: Type[]

  constructor(private readonly options: SocketwiseOptions) {
    this.io = options.io || new Server(options.port)
    this.portals = this.options.portals

    this.registerPortals()
  }

  private registerPortals(): void {
    this.io.on(SocketEvent.CONNECT, (socket: Socket) => {
      this.portals.forEach((portal) => {
        this.registerPortal(portal, socket)
      })
    })
  }

  private async registerPortal(portal: Type, socket: Socket): Promise<void> {
    const connectedAction = ActionStorage.getSingleActionMetadata(portal, SocketEvent.CONNECT)
    const messageActions = ActionStorage.getActionsMetadata(portal, SocketEvent.MESSAGE)

    if (connectedAction) {
      await this.executeAction(connectedAction, socket)
    }

    if (messageActions) {
      messageActions.forEach((action) => {
        socket.on(
          action.options.name,
          async (message: unknown) => await this.executeAction(action, socket, message)
        )
      })
    }
  }

  private async executeAction(
    action: ActionMetadata,
    socket: Socket,
    message?: unknown
  ): Promise<void> {
    const portalInstance = Container.resolve(action.target as Type)
    const actionParams = this.getActionParams(action, message, socket)
    await action.value.bind(portalInstance)(...actionParams)
  }

  private getActionParams(action: ActionMetadata, message: unknown, socket: Socket): any {
    const paramResponseMap: Record<ParamType, unknown> = {
      [ParamType.MESSAGE]: message,
      [ParamType.SOCKET_IO]: this.io,
      [ParamType.CONNECTED_SOCKET]: socket,
      [ParamType.SOCKET_ID]: socket.id,
      [ParamType.SOCKET_REQUEST]: socket.request,
      [ParamType.SOCKET_ROOMS]: socket.rooms
    }
    return ParamStorage.getParamsMetadata(action.target as Type, action.value)?.map(
      (param) => paramResponseMap[param.paramType]
    )
  }
}
