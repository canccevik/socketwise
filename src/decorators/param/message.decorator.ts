import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Message(): Function {
  return createParamDecorator(ParamType.MESSAGE)
}
