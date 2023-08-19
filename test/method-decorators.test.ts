import { Socketwise } from '../src'
import { UserPortal } from './portals'
import { io, Socket } from 'socket.io-client'

describe('Method Decorators', () => {
  let app: Socketwise
  let client: Socket

  beforeAll(() => {
    app = new Socketwise({
      portals: [UserPortal],
      port: Number(3000)
    })
    client = io('ws://localhost:3000/users/12')
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
})
