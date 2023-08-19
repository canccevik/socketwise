import { EmitType } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function EmitOnFail(name: string, data?: unknown): MethodDecorator {
  return createMethodDecorator(EmitType.FAIL, { name, data })
}
