import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function SocketId(): Function {
  return createParamDecorator(ParamType.SOCKET_ID)
}
