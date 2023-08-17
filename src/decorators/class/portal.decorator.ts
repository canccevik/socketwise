import { Container } from 'magnodi'
import { PortalStorage } from '../../storages'
import { Type } from '../../interfaces'

export interface PortalOptions {
  namespace: string
}

export function Portal(options?: PortalOptions): ClassDecorator {
  return (target: Object): void => {
    Container.provide(target as Type, target as Type)
    PortalStorage.addPortalMetadata({ target, options })
  }
}
