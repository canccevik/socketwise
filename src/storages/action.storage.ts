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
    value: Function,
    type: SocketEvent | EmitType
  ): ActionMetadata | undefined {
    return this.actions.find(
      (action) => action.target === target && action.value === value && action.type === type
    )
  }

  public getSingleActionMetadataByTarget(
    target: Type,
    type: SocketEvent | EmitType
  ): ActionMetadata | undefined {
    return this.actions.find((action) => action.target === target && action.type === type)
  }

  public getActionsMetadata(
    target: Type,
    value: Function,
    type: SocketEvent | EmitType
  ): ActionMetadata[] | undefined {
    return this.actions.filter(
      (action) => action.target === target && action.value === value && action.type === type
    )
  }

  public getActionsMetadataByTarget(
    target: Type,
    type: SocketEvent | EmitType
  ): ActionMetadata[] | undefined {
    return this.actions.filter((action) => action.target === target && action.type === type)
  }
}

export const ActionStorage = new ActionStorageHost()
