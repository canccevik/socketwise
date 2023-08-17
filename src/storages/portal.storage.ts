import { PortalMetadata } from '../metadata'

class PortalStorageHost {
  private portals = new Array<PortalMetadata>()

  public addPortalMetadata(metadata: PortalMetadata): void {
    this.portals.push(metadata)
  }

  public getPortalMetadataByTarget<Target>(target: Target): PortalMetadata | undefined {
    return this.portals.find((portal) => portal.target === target)
  }
}

export const PortalStorage = new PortalStorageHost()
