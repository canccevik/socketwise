import { Server, Socket } from 'socket.io'
import { Type } from './interfaces'
import { ActionStorage, ParamStorage, PortalStorage } from './storages'
import { SocketEvent } from './enums'
import { Container } from 'magnodi'
import { ActionMetadata, ParamType } from './metadata'
import { getClassesBySuffix } from './utils'
import { pathToRegexp, match, Path } from 'path-to-regexp'

export interface SocketwiseOptions {
  io?: Server
  port?: number
  portals: Type[] | string
}

export class Socketwise {
  public io: Server

  constructor(private readonly options: SocketwiseOptions) {
    this.io = options.io || new Server(options.port)

    this.registerPortals()
  }

  private async registerPortals(): Promise<void> {
    if (typeof this.options.portals === 'string') {
      this.options.portals = await getClassesBySuffix(this.options.portals)
    }

    this.options.portals.forEach((portal) => {
      const portalMetadata = PortalStorage.getPortalMetadataByTarget(portal)
      const namespace = portalMetadata?.namespace

      if (!portalMetadata) return

      if (!namespace) {
        return this.io.on(SocketEvent.CONNECT, (socket) => this.registerPortal(portal, socket))
      }
      this.io
        .of(namespace instanceof RegExp ? namespace : pathToRegexp(namespace))
        .on(SocketEvent.CONNECT, (socket) => this.registerPortal(portal, socket))
    })
  }

  private async registerPortal(portal: Type, socket: Socket): Promise<void> {
    const connectedAction = ActionStorage.getSingleActionMetadata(portal, SocketEvent.CONNECT)
    const disconnectedAction = ActionStorage.getSingleActionMetadata(portal, SocketEvent.DISCONNECT)
    const messageActions = ActionStorage.getActionsMetadata(portal, SocketEvent.MESSAGE)
    const disconnectingAction = ActionStorage.getSingleActionMetadata(
      portal,
      SocketEvent.DISCONNECTING
    )

    if (connectedAction) {
      await this.executeAction(connectedAction, socket)
    }

    if (disconnectedAction) {
      socket.on(
        SocketEvent.DISCONNECT,
        async () => await this.executeAction(disconnectedAction, socket)
      )
    }

    if (disconnectingAction) {
      socket.on(
        SocketEvent.DISCONNECTING,
        async () => await this.executeAction(disconnectingAction, socket)
      )
    }

    if (messageActions) {
      messageActions.forEach((action) => {
        socket.on(
          action.options.name,
          async (message: unknown, ack: Function) =>
            await this.executeAction(action, socket, message, ack)
        )
      })
    }
  }

  private async executeAction(
    action: ActionMetadata,
    socket: Socket,
    message?: unknown,
    ack?: Function
  ): Promise<void> {
    const portalInstance = Container.resolve(action.target as Type)
    const actionParams = this.getActionParams(action, socket, message, ack)
    await action.value.bind(portalInstance)(...actionParams)
  }

  private getActionParams(
    action: ActionMetadata,
    socket: Socket,
    message?: unknown,
    ack?: Function
  ): unknown[] {
    const portalMetadata = PortalStorage.getPortalMetadataByTarget(action.target as Type)
    const paramsMetadata = ParamStorage.getParamsMetadata(action.target as Type, action.value)

    return paramsMetadata.map((param) => {
      const namespaceParams = match(portalMetadata?.namespace as Path)(socket.nsp.name) || undefined
      const paramResponseMap: Record<ParamType, unknown> = {
        [ParamType.MESSAGE]: message,
        [ParamType.SOCKET_IO]: this.io,
        [ParamType.CONNECTED_SOCKET]: socket,
        [ParamType.SOCKET_ID]: socket.id,
        [ParamType.SOCKET_REQUEST]: socket.request,
        [ParamType.SOCKET_ROOMS]: socket.rooms,
        [ParamType.MESSAGE_ACK]: ack,
        [ParamType.SOCKET_QUERY_PARAM]: socket.handshake.query[param.options?.name as string],
        [ParamType.NAMESPACE_PARAMS]: namespaceParams?.params
      }
      return paramResponseMap[param.paramType]
    })
  }
}
