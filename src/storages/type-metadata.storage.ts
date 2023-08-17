import { PortalMetadata } from '../metadata'

class TypeMetadataStorageHost {
  private portals = new Array<PortalMetadata>()

  public addPortalMetadata(metadata: PortalMetadata): void {
    this.portals.push(metadata)
  }

  public getPortalMetadataByTarget<Target>(target: Target): PortalMetadata | undefined {
    return this.portals.find((portal) => portal.target === target)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
