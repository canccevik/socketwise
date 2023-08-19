import { Socketwise } from '../src'
import { UserPortal } from './portals'
import { io, Socket } from 'socket.io-client'
import dotenv from 'dotenv'

dotenv.config()

describe('Method Decorators', () => {
  let app: Socketwise
  let client: Socket

  beforeAll(() => {
    app = new Socketwise({
      portals: [UserPortal],
      port: Number(process.env.PORT)
    })
    client = io(`ws://localhost:${process.env.PORT}/users/12`)
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
