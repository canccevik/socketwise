import { Type } from '../interfaces'
import { ActionMetadata } from '../metadata'

class ActionStorageHost {
  private actions = new Array<ActionMetadata>()

  public addActionMetadata(metadata: ActionMetadata): void {
    this.actions.push(metadata)
  }

  public getActionsMetadataByTarget(target: Type): ActionMetadata[] | undefined {
    return this.actions.filter((action) => action.target === target)
  }
}

export const ActionStorage = new ActionStorageHost()
