import { TypeMetadataStorage } from '../../storages'

export interface PortalOptions {
  namespace: string
}

export function Portal(options: PortalOptions): ClassDecorator {
  return (target: Object): void => {
    TypeMetadataStorage.addPortalMetadata({
      target,
      options
    })
  }
}
