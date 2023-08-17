import { SocketEvent } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function OnConnect(): MethodDecorator {
  return createMethodDecorator(SocketEvent.CONNECT)
}
