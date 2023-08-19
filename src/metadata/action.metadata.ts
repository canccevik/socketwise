import { EmitType, SocketEvent } from '../enums'

export interface ActionMetadata {
  target: Object
  value: Function
  type: SocketEvent | EmitType
  options?: any
}
