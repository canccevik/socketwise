import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function NamespaceParams(): Function {
  return createParamDecorator(ParamType.NAMESPACE_PARAMS)
}
