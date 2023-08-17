import { SocketEvent } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function OnDisconnecting(): MethodDecorator {
  return createMethodDecorator(SocketEvent.DISCONNECTING)
}
