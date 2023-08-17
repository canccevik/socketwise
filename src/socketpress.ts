import { Type } from './interfaces'

export interface SocketOptions {
  port: number
  portals: Type[]
}

export class Socketpress {
  constructor(private readonly socketOptions: SocketOptions) {}
}
