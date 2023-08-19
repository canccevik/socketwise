import { Socketwise } from '../src'
import { UserPortal } from './portals'
import { io, Socket } from 'socket.io-client'

describe('Method Decorators', () => {
  let app: Socketwise
  let client: Socket
  let port: number

  beforeAll(() => {
    port = 3000
    app = new Socketwise({
      portals: [UserPortal],
      port
    })
    client = io(`ws://localhost:${port}/users/12`)
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
      client.on('user_message', () => {
        done()
      })
      client.emit('new_user')
    })
  })
})
