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
      // ARRANGE & ASSERT
      client.on('connected', () => {
        done()
      })
    })
  })

  describe('SubscribeMessage Decorator', () => {
    it('should SubscribeMessage decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('method_message', () => {
        done()
      })

      // ACT
      client.emit('new_method')
    })
  })

  describe('EmitOnSuccess Decorator', () => {
    it('should EmitOnSuccess decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('sucess_emitted', (data) => {
        expect(data).toEqual('success')
        done()
      })

      // ACT
      client.emit('emit_success')
    })
  })

  describe('EmitOnFail Decorator', () => {
    it('should data be equal to throwed error message', (done) => {
      // ARRANGE & ASSERT
      client.on('fail_emitted', (data) => {
        expect(data).toEqual('fail')
        done()
      })

      // ACT
      client.emit('emit_fail')
    })

    it('should emitting custom fail response work', (done) => {
      // ARRANGE & ASSERT
      client.on('custom_fail_emitted', (data) => {
        expect(data).toEqual({ error: true })
        done()
      })

      // ACT
      client.emit('emit_custom_fail')
    })

    it('should emitting multiple fails work (1)', (done) => {
      // ARRANGE & ASSERT
      client.on('fail_emitted', (data) => {
        expect(data).toEqual('fail')
        done()
      })

      // ACT
      client.emit('emit_multiple_fail')
    })

    it('should emitting multiple fails work (2)', (done) => {
      // ARRANGE & ASSERT
      client.on('fail_emitted_1', (data) => {
        expect(data).toEqual({ error: true })
        done()
      })

      // ACT
      client.emit('emit_multiple_fail')
    })

    it('should emitting multiple fails work (3)', (done) => {
      // ARRANGE & ASSERT
      client.on('fail_emitted_2', (data) => {
        expect(data).toEqual({ message: 'error' })
        done()
      })

      // ACT
      client.emit('emit_multiple_fail')
    })
  })
})
