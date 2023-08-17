import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function MessageAck(): Function {
  return createParamDecorator(ParamType.MESSAGE_ACK)
}
