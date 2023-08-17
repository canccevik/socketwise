import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function SocketRooms(): Function {
  return createParamDecorator(ParamType.SOCKET_ROOMS)
}
