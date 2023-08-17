import { SocketEvent } from '../../enums'
import { createParamDecorator } from './create-param-decorator'

export function SubscribeMessage(name: string): MethodDecorator {
  return createParamDecorator(SocketEvent.MESSAGE, { name })
}
