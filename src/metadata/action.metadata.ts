import { SocketEvent } from '../enums'

export interface ActionMetadata {
  target: Object
  value: Function
  type: SocketEvent
  options?: any
}
