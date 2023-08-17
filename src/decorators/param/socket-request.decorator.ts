import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function SocketRequest(): Function {
  return createParamDecorator(ParamType.SOCKET_REQUEST)
}
