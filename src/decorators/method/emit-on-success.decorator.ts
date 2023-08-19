import { EmitType } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function EmitOnSuccess(name: string): MethodDecorator {
  return createMethodDecorator(EmitType.SUCCESS, { name })
}
