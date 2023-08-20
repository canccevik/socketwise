import { Socketwise } from '../src'
import { MethodPortal } from './portals'
import { io, Socket } from 'socket.io-client'

describe('Method Decorators', () => {
  let app: Socketwise
  let client: Socket
  let port: number

  beforeAll(() => {
    port = 3000
    app = new Socketwise({ portals: [MethodPortal], port })
    client = io(`ws://localhost:${port}/methods`)
  })

  afterAll(() => {
    app.io.close()
    client.close()
  })

  describe('OnConnect Decorator', () => {
    it('should OnConnect decorator work', (done) => {
      client.on('connected', () => {
        done()
      })
    })
  })

  describe('SubscribeMessage Decorator', () => {
    it('should SubscribeMessage decorator work', (done) => {
      client.on('method_message', () => {
        done()
      })
      client.emit('new_method')
    })
  })

  describe('EmitOnSuccess Decorator', () => {
    it('should EmitOnSuccess decorator work', (done) => {
      client.on('sucess_emitted', (data) => {
        expect(data).toEqual('success')
        done()
      })
      client.emit('emit_success')
    })
  })

  describe('EmitOnFail Decorator', () => {
    it('should data be equal to throwed error message', (done) => {
      client.on('fail_emitted', (data) => {
        expect(data).toEqual('fail')
        done()
      })
      client.emit('emit_fail')
    })

    it('should emitting custom fail response work', (done) => {
      client.on('custom_fail_emitted', (data) => {
        expect(data).toEqual({ error: true })
        done()
      })
      client.emit('emit_custom_fail')
    })

    it('should emitting multiple fails work (1)', (done) => {
      client.on('fail_emitted', (data) => {
        expect(data).toEqual('fail')
        done()
      })
      client.emit('emit_multiple_fail')
    })

    it('should emitting multiple fails work (2)', (done) => {
      client.on('fail_emitted_1', (data) => {
        expect(data).toEqual({ error: true })
        done()
      })
      client.emit('emit_multiple_fail')
    })

    it('should emitting multiple fails work (3)', (done) => {
      client.on('fail_emitted_2', (data) => {
        expect(data).toEqual({ message: 'error' })
        done()
      })
      client.emit('emit_multiple_fail')
    })
  })
})
