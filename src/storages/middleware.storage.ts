import { Type } from '../interfaces'
import { MiddlewareMetadata } from '../metadata'

class MiddlewareStorageHost {
  private middlewares = new Array<MiddlewareMetadata>()

  public addMiddlewareMetadata(metadata: MiddlewareMetadata): void {
    this.middlewares.push(metadata)
  }

  public getMiddlewareMetadataByTarget(target: Type): MiddlewareMetadata | undefined {
    return this.middlewares.find((middleware) => middleware.target === target)
  }
}

export const MiddlewareStorage = new MiddlewareStorageHost()
