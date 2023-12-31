import { Socketwise } from '../src'
import { ParamPortal } from './portals'
import { io, Socket } from 'socket.io-client'

describe('Param Decorators', () => {
  let app: Socketwise
  let client: Socket
  let port: number
  let idParam: number

  beforeAll(() => {
    port = 3000
    idParam = 12
    app = new Socketwise({ portals: [ParamPortal], port })
    client = io(`ws://localhost:${port}/params/${idParam}`, {
      query: { packageName: 'socketwise' }
    })
  })

  afterAll(() => {
    app.io.close()
    client.close()
  })

  describe('ConnectedSocket Decorator', () => {
    it('should ConnectedSocket decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('connected_socket_response', (data) => {
        expect(data).toEqual(client.id)
        done()
      })

      // ACT
      client.emit('connected_socket')
    })
  })

  describe('SocketId Decorator', () => {
    it('should SocketId decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('socket_id_response', (data) => {
        expect(data).toEqual(client.id)
        done()
      })

      // ACT
      client.emit('socket_id')
    })
  })

  describe('SocketIO Decorator', () => {
    it('should SocketIO decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('socket_io_response', (data) => {
        expect(data).toEqual(true)
        done()
      })

      // ACT
      client.emit('socket_io')
    })
  })

  describe('Message Decorator', () => {
    it('should Message decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('message_decorator_response', (data) => {
        expect(data).toEqual('test message')
        done()
      })

      // ACT
      client.emit('message_decorator', 'test message')
    })
  })

  describe('MessageAck Decorator', () => {
    it('should MessageAck decorator work', (done) => {
      // ARRANGE & ACT & ASSERT
      client.emit('message_ack', 'test message', (data: unknown) => {
        expect(data).toEqual('test message')
        done()
      })
    })
  })

  describe('SocketQueryParam Decorator', () => {
    it('should SocketQueryParam decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('socket_query_param_response', (data) => {
        expect(data).toEqual('socketwise')
        done()
      })

      // ACT
      client.emit('socket_query_param')
    })
  })

  describe('SocketRequest Decorator', () => {
    it('should SocketRequest decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('socket_request_response', (data) => {
        expect(data).toEqual(true)
        done()
      })

      // ACT
      client.emit('socket_request')
    })
  })

  describe('SocketRooms Decorator', () => {
    it('should SocketRooms decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('socket_rooms_response', (data) => {
        expect(data).toEqual(true)
        done()
      })

      // ACT
      client.emit('socket_rooms')
    })
  })

  describe('NamespaceParams Decorator', () => {
    it('should NamespaceParams decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('namespace_params_response', (data) => {
        expect(data).toEqual({ id: idParam.toString() })
        done()
      })

      // ACT
      client.emit('namespace_params')
    })
  })

  describe('NamespaceParam Decorator', () => {
    it('should NamespaceParam decorator work', (done) => {
      // ARRANGE & ASSERT
      client.on('namespace_param_response', (data) => {
        expect(data).toEqual(idParam.toString())
        done()
      })

      // ACT
      client.emit('namespace_param')
    })
  })
})
