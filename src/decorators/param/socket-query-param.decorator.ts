import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function SocketQueryParam(name: string): Function {
  return createParamDecorator(ParamType.SOCKET_QUERY_PARAM, { name })
}
