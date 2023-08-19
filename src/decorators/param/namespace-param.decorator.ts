import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function NamespaceParam(name: string): Function {
  return createParamDecorator(ParamType.NAMESPACE_PARAM, { name })
}
