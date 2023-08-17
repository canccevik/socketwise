import { Server, Socket } from 'socket.io'
import { Type } from './interfaces'
import { ActionStorage } from './storages'
import { SocketEvent } from './enums'
import { Container } from 'magnodi'

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
    const portalInstance = Container.resolve(portal)
    const messageActions = ActionStorage.getActionsMetadata(portal, SocketEvent.MESSAGE)

    if (messageActions) {
      messageActions.forEach((action) =>
        socket.on(action.options.name, action.value.bind(portalInstance))
      )
    }
  }
}
