import { Socketwise } from '../src'
import { ParamPortal } from './portals'
import { io, Socket } from 'socket.io-client'

describe('Param Decorators', () => {
  let app: Socketwise
  let client: Socket
  let port: number

  beforeAll(() => {
    port = 3000
    app = new Socketwise({ portals: [ParamPortal], port })
    client = io(`ws://localhost:${port}/params`, { query: { packageName: 'socketwise' } })
  })

  afterAll(() => {
    app.io.close()
    client.close()
  })

  describe('ConnectedSocket Decorator', () => {
    it('should ConnectedSocket decorator work', (done) => {
      client.on('connected_socket_response', (data) => {
        expect(data).toEqual(client.id)
        done()
      })
      client.emit('connected_socket')
    })
  })

  describe('SocketId Decorator', () => {
    it('should SocketId decorator work', (done) => {
      client.on('socket_id_response', (data) => {
        expect(data).toEqual(client.id)
        done()
      })
      client.emit('socket_id')
    })
  })

  describe('SocketIO Decorator', () => {
    it('should SocketIO decorator work', (done) => {
      client.on('socket_io_response', (data) => {
        expect(data).toEqual(true)
        done()
      })
      client.emit('socket_io')
    })
  })

  describe('Message Decorator', () => {
    it('should Message decorator work', (done) => {
      client.on('message_decorator_response', (data) => {
        expect(data).toEqual('test message')
        done()
      })
      client.emit('message_decorator', 'test message')
    })
  })

  describe('MessageAck Decorator', () => {
    it('should MessageAck decorator work', (done) => {
      client.emit('message_ack', 'test message', (data: unknown) => {
        expect(data).toEqual('test message')
        done()
      })
    })
  })

  describe('SocketQueryParam Decorator', () => {
    it('should SocketQueryParam decorator work', (done) => {
      client.on('socket_query_param_response', (data) => {
        expect(data).toEqual('socketwise')
        done()
      })
      client.emit('socket_query_param')
    })
  })
})
