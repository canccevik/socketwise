import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function SocketIO(): Function {
  return createParamDecorator(ParamType.SOCKET_IO)
}
