import { Server, Socket } from 'socket.io'
import { SocketwiseMiddleware, Type } from './interfaces'
import { ActionStorage, MiddlewareStorage, ParamStorage, PortalStorage } from './storages'
import { EmitType, SocketEvent } from './enums'
import { Container } from 'magnodi'
import { ActionMetadata, ParamMetadata, ParamType } from './metadata'
import { getClassesBySuffix } from './utils'
import { pathToRegexp, match, Path } from 'path-to-regexp'
import { plainToInstance } from 'class-transformer'

export interface SocketwiseOptions {
  io?: Server
  port?: number
  portals: Type[] | string
  middlewares?: Type[] | string
  useClassTransformer?: boolean
}

export class Socketwise {
  public io: Server

  constructor(private options: SocketwiseOptions) {
    this.io = options.io || new Server(options.port)
    this.options.useClassTransformer ??= true

    this.registerMiddlewares()
    this.registerPortals()
  }

  private async registerMiddlewares(): Promise<void> {
    if (typeof this.options.middlewares === 'string') {
      this.options.middlewares = await getClassesBySuffix(this.options.middlewares)
    }

    this.options.middlewares?.forEach((middleware) => {
      const middlewareMetadata = MiddlewareStorage.getMiddlewareMetadataByTarget(middleware)
      const middlewareInstance = Container.resolve<SocketwiseMiddleware>(middleware)
      const namespace = middlewareMetadata?.namespace

      if (!middlewareMetadata) return

      if (!namespace) {
        return this.io.use(middlewareInstance.use.bind(middlewareInstance))
      }
      this.io.on(SocketEvent.NEW_NAMESPACE, (nsp) => {
        const namespaces = Array.isArray(namespace) ? namespace : [namespace]

        const shouldApply = namespaces.some((namespace) => {
          const namespaceRegexp = namespace instanceof RegExp ? namespace : pathToRegexp(namespace)
          return namespaceRegexp.test(nsp.name)
        })
        shouldApply && nsp.use(middlewareInstance.use.bind(middlewareInstance))
      })
    })
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
    const messageActions = ActionStorage.getActionsMetadataByTarget(portal, SocketEvent.MESSAGE)
    const connectedAction = ActionStorage.getSingleActionMetadataByTarget(
      portal,
      SocketEvent.CONNECT
    )
    const disconnectedAction = ActionStorage.getSingleActionMetadataByTarget(
      portal,
      SocketEvent.DISCONNECT
    )
    const disconnectingAction = ActionStorage.getSingleActionMetadataByTarget(
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

    try {
      const result = await action.value.bind(portalInstance)(...actionParams)
      result && this.handleSuccessfulResult(action, socket, result)
    } catch (error) {
      this.handleFailResult(action, socket, error)
    }
  }

  private handleSuccessfulResult(action: ActionMetadata, socket: Socket, result: unknown): void {
    const successAction = ActionStorage.getSingleActionMetadata(
      action.target as Type,
      action.value,
      EmitType.SUCCESS
    )
    socket.emit(successAction?.options.name, result)
  }

  private handleFailResult(action: ActionMetadata, socket: Socket, error: any): void {
    const errorData = error instanceof Error ? error.message : error
    const failActions = ActionStorage.getActionsMetadata(
      action.target as Type,
      action.value,
      EmitType.FAIL
    )

    failActions?.forEach((failAction) => {
      socket.emit(failAction.options.name, failAction.options.data || errorData)
    })
  }

  private getActionParams(
    action: ActionMetadata,
    socket: Socket,
    message?: unknown,
    ack?: Function
  ): unknown[] {
    const paramsMetadata = ParamStorage.getParamsMetadata(action.target as Type, action.value)
    const namespaceParams = this.extractNamespaceParams(action, socket)

    return paramsMetadata.map((param) => {
      const paramResponseMap: Record<ParamType, unknown> = {
        [ParamType.MESSAGE]: this.transformMessage(message, param),
        [ParamType.SOCKET_IO]: this.io,
        [ParamType.CONNECTED_SOCKET]: socket,
        [ParamType.SOCKET_ID]: socket.id,
        [ParamType.SOCKET_REQUEST]: socket.request,
        [ParamType.SOCKET_ROOMS]: socket.rooms,
        [ParamType.MESSAGE_ACK]: ack,
        [ParamType.SOCKET_QUERY_PARAM]: socket.handshake.query[param.options?.name as string],
        [ParamType.NAMESPACE_PARAMS]: namespaceParams,
        [ParamType.NAMESPACE_PARAM]:
          namespaceParams && namespaceParams[param.options?.name as string]
      }
      return paramResponseMap[param.paramType]
    })
  }

  private extractNamespaceParams(
    action: ActionMetadata,
    socket: Socket
  ): Record<string, string> | undefined {
    const portalMetadata = PortalStorage.getPortalMetadataByTarget(action.target as Type)

    if (!portalMetadata?.namespace) return

    const matcher = match(portalMetadata?.namespace as Path)
    const matchResult = matcher(socket.nsp.name)

    return JSON.parse(JSON.stringify(matchResult)).params
  }

  private transformMessage(message: unknown, param: ParamMetadata): unknown {
    if (param.paramType !== ParamType.MESSAGE || !this.options.useClassTransformer) {
      return message
    }
    return plainToInstance(param.type, message)
  }
}
