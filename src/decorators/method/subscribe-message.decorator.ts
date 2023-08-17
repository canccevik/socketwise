import { SocketEvent } from '../../enums'
import { ActionStorage } from '../../storages'

export function SubscribeMessage(name: string): MethodDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ActionStorage.addActionMetadata({
      target,
      value: targetMethod,
      type: SocketEvent.MESSAGE,
      options: { name }
    })
  }
}
