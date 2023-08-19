import { EmitType, SocketEvent } from '../enums'
import { Type } from '../interfaces'
import { ActionMetadata } from '../metadata'

class ActionStorageHost {
  private actions = new Array<ActionMetadata>()

  public addActionMetadata(metadata: ActionMetadata): void {
    this.actions.push(metadata)
  }

  public getSingleActionMetadata(
    target: Type,
    type: SocketEvent | EmitType
  ): ActionMetadata | undefined {
    return this.actions.find((action) => action.target === target && action.type === type)
  }

  public getActionsMetadata(
    target: Type,
    type: SocketEvent | EmitType
  ): ActionMetadata[] | undefined {
    return this.actions.filter((action) => action.target === target && action.type === type)
  }
}

export const ActionStorage = new ActionStorageHost()
