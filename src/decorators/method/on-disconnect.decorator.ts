import { SocketEvent } from '../../enums'
import { createParamDecorator } from './create-param-decorator'

export function OnDisconnect(): MethodDecorator {
  return createParamDecorator(SocketEvent.DISCONNECT)
}
