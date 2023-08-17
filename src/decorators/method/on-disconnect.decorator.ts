import { SocketEvent } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function OnDisconnect(): MethodDecorator {
  return createMethodDecorator(SocketEvent.DISCONNECT)
}
