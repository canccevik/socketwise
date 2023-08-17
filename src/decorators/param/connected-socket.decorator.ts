import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function ConnectedSocket(): Function {
  return createParamDecorator(ParamType.CONNECTED_SOCKET)
}
