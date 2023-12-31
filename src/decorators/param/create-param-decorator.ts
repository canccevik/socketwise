import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export function createParamDecorator(
  paramType: ParamType,
  options?: Record<string, unknown>
): Function {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]
    const type = Reflect.getMetadata('design:paramtypes', target, propertyKey).at(parameterIndex)

    ParamStorage.addParamMetadata({
      target: target.constructor,
      value: targetMethod,
      index: parameterIndex,
      paramType,
      options,
      type
    })
  }
}
