import { SocketEvent } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function SubscribeMessage(name: string): MethodDecorator {
  return createMethodDecorator(SocketEvent.MESSAGE, { name })
}
