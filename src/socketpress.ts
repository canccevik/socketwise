import { Type } from './interfaces'

export interface SocketpressOptions {
  port: number
  portals: Type[]
}

export class Socketpress {
  constructor(private readonly options: SocketpressOptions) {}
}
