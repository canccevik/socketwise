import { Container } from 'magnodi'
import { PortalStorage } from '../../storages'
import { Type } from '../../interfaces'

export function Portal(namespace?: string | RegExp): ClassDecorator {
  return (target: Object): void => {
    Container.provide(target as Type, target as Type)
    PortalStorage.addPortalMetadata({ target, namespace })
  }
}
