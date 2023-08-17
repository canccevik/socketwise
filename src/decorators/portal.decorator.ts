import { PortalStorage } from '../storages'

export function Portal(): ClassDecorator {
  return (target: object): void => {
    PortalStorage.addPortalMetadata({
      target
    })
  }
}
