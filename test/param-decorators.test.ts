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
    client = io(`ws://localhost:${port}/params`)
  })

  afterAll(() => {
    app.io.close()
    client.close()
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
})
