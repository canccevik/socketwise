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

  private registerPortal(portal: Type, socket: Socket): void {
    const messageActions = ActionStorage.getActionsMetadata(portal, SocketEvent.MESSAGE)

    if (messageActions) {
      messageActions.forEach((action) => {
        socket.on(
          action.options.name,
          async (message: unknown) => await this.executeAction(action, message, socket)
        )
      })
    }
  }

  private async executeAction(
    action: ActionMetadata,
    message: unknown,
    socket: Socket
  ): Promise<void> {
    const portalInstance = Container.resolve(action.target as Type)
    const actionParams = this.getActionParams(action, message, socket)

    await action.value.bind(portalInstance)(...actionParams)
  }

  private getActionParams(action: ActionMetadata, message: unknown, socket: Socket): any {
    const paramsMetadata = ParamStorage.getParamsMetadata(action.target as Type, action.value)

    return paramsMetadata?.map((param) => {
      switch (param.paramType) {
        case ParamType.MESSAGE:
          return message
        case ParamType.CONNECTED_SOCKET:
          return socket
      }
    })
  }
}
