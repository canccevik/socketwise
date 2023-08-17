import { Type } from '../interfaces'
import { ActionMetadata, PortalMetadata } from '../metadata'

class TypeMetadataStorageHost {
  private portals = new Array<PortalMetadata>()
  private actions = new Array<ActionMetadata>()

  public addPortalMetadata(metadata: PortalMetadata): void {
    this.portals.push(metadata)
  }

  public getPortalMetadataByTarget(target: Type): PortalMetadata | undefined {
    return this.portals.find((portal) => portal.target === target)
  }

  public addActionMetadata(metadata: ActionMetadata): void {
    this.actions.push(metadata)
  }

  public getActionsMetadataByTarget(target: Type): ActionMetadata[] | undefined {
    return this.actions.filter((action) => action.target === target)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
