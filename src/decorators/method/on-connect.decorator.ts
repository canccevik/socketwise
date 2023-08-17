import { SocketEvent } from '../../enums'
import { ActionStorage } from '../../storages'

export function OnConnect(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ActionStorage.addActionMetadata({
      target: target.constructor,
      value: targetMethod,
      type: SocketEvent.CONNECT
    })
  }
}
