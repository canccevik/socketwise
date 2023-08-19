import { Container } from 'magnodi'
import { Type } from '../../interfaces'
import { MiddlewareStorage } from '../../storages'

export function Middleware(namespace?: string | RegExp | Array<string | RegExp>): ClassDecorator {
  return (target: Object): void => {
    Container.provide(target as Type, target as Type)
    MiddlewareStorage.addMiddlewareMetadata({ target, namespace })
  }
}
