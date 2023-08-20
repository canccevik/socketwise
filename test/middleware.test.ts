import { Socketwise } from '../src'
import { MiddlewarePortal } from './portals'
import { CustomMiddleware } from './middlewares'
import { io, Socket } from 'socket.io-client'

describe('Method Decorators', () => {
  let app: Socketwise
  let client: Socket
  let port: number

  beforeAll(() => {
    port = 3000
    app = new Socketwise({ portals: [MiddlewarePortal], middlewares: [CustomMiddleware], port })
    client = io(`ws://localhost:${port}/middleware`)
  })

  afterAll(() => {
    app.io.close()
    client.close()
  })

  describe('Middleware', () => {
    it('should middleware work', (done) => {
      // ARRANGE & ASSERT
      client.on('connected', (data) => {
        expect(data).toEqual(['packageName=socketwise'])
        done()
      })
    })
  })
})
