import { ParamMetadata } from '../metadata'

class ParamStorageHost {
  private params = new Array<ParamMetadata>()

  public addParamMetadata(metadata: ParamMetadata): void {
    this.params.push(metadata)
  }

  public getParamsMetadata(target: Object, value: Function): ParamMetadata[] {
    return this.params
      .filter((metadata) => metadata.target === target && metadata.value === value)
      .sort((a, b) => a.index - b.index)
  }
}

export const ParamStorage = new ParamStorageHost()
