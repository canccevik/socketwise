import { SocketEvent } from '../../enums'
import { createParamDecorator } from './create-param-decorator'

export function OnDisconnecting(): MethodDecorator {
  return createParamDecorator(SocketEvent.DISCONNECTING)
}
