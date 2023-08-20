import { Socket } from 'socket.io'
import {
  ConnectedSocket,
  EmitOnFail,
  EmitOnSuccess,
  OnConnect,
  Portal,
  SubscribeMessage
} from '../../src'

@Portal('/methods')
export class MethodPortal {
  @OnConnect()
  public onConnect(@ConnectedSocket() socket: Socket): void {
    socket.emit('connected')
  }

  @SubscribeMessage('new_method')
  public onMessage(@ConnectedSocket() socket: Socket): void {
    socket.emit('method_message')
  }

  @SubscribeMessage('emit_success')
  @EmitOnSuccess('sucess_emitted')
  public emitSuccess(): string {
    return 'success'
  }

  @SubscribeMessage('emit_fail')
  @EmitOnFail('fail_emitted')
  public emitFail(): void {
    throw new Error('fail')
  }

  @SubscribeMessage('emit_custom_fail')
  @EmitOnFail('custom_fail_emitted', { error: true })
  public emitCustomFail(): void {
    throw new Error('fail')
  }

  @SubscribeMessage('emit_multiple_fail')
  @EmitOnFail('fail_emitted')
  @EmitOnFail('fail_emitted_1', { error: true })
  @EmitOnFail('fail_emitted_2', { message: 'error' })
  public emitMultipleFail(): void {
    throw new Error('fail')
  }
}
