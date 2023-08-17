import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export function Message(): Function {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ParamStorage.addParamMetadata({
      target,
      value: targetMethod,
      index: parameterIndex,
      paramType: ParamType.MESSAGE
    })
  }
}
