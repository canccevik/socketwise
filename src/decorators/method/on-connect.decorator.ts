import { SocketEvent } from '../../enums'
import { createParamDecorator } from './create-param-decorator'

export function OnConnect(): MethodDecorator {
  return createParamDecorator(SocketEvent.CONNECT)
}
