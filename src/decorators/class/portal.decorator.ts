import { PortalStorage } from '../../storages'

export interface PortalOptions {
  namespace: string
}

export function Portal(options?: PortalOptions): ClassDecorator {
  return (target: Object): void => {
    PortalStorage.addPortalMetadata({
      target,
      options
    })
  }
}
