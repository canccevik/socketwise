<p align="center">
<img src="https://raw.githubusercontent.com/canccevik/socketwise/main/.github/assets/logo.jpg" alt="Socketwise Logo" width="500" height="250"/>
</p>

<p align="center">🔌 A powerful framework for building real-time applications on top of <a href="https://github.com/socketio/socket.io">Socket.IO</a> using class-based approach with decorators.</p>

# Table of Contents

- [Installation](#installation)
- [Example usage](#example-usage)
- [More examples](#more-examples)
  - [Loading all portals by suffix](#loading-all-portals-by-suffix)
  - [Loading all middlewares by suffix](#loading-all-middlewares-by-suffix)
  - [Handling connection event](#handling-connection-event)
  - [Handling disconnecting event](#handling-disconnecting-event)
  - [Handling disconnected event](#handling-disconnected-event)
  - [@ConnectedSocket() decorator](#connectedsocket-decorator)
  - [@Message() decorator](#message-decorator)
  - [@MessageAck() decorator](#messageack-decorator)
  - [@SocketId() decorator](#socketid-decorator)
  - [@SocketIO() decorator](#socketio-decorator)
  - [@SocketQueryParam() decorator](#socketqueryparam-decorator)
  - [@SocketRequest() decorator](#socketrequest-decorator)
  - [@SocketRooms() decorator](#socketrooms-decorator)
  - [@EmitOnSuccess() decorator](#emitonsuccess-decorator)
  - [@EmitOnFail() decorator](#emitonfail-decorator)
- [Using socket.io namespaces](#using-socketio-namespaces)
  - [Using namespaces](#using-namespaces)
  - [@NamespaceParams decorator](#namespaceparams-decorator)
  - [@NamespaceParam decorator](#namespaceparam-decorator)
- [Using middlewares](#using-middlewares)
- [Creating instance of class from message](#creating-instance-of-class-from-message)
- [Using dependency injection](#using-dependency-injection)
- [Contributing](#contributing)
- [License](#license)

# Installation

1. Install socketwise:

   Using npm:

   ```js
   npm install socketwise
   ```

   Using yarn:

   ```js
   yarn add socketwise
   ```

   Using pnpm:

   ```js
   pnpm add socketwise
   ```

2. Install typings for socket.io:

   ```js
   npm install --save-dev @types/socket.io
   ```

3. Set this options in `tsconfig.json` file of your project:

   ```ts
   {
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true
   }
   ```

# Example usage

1. Create a file called `message.portal.ts`

```ts
import { Socket } from 'socket.io'
import {
  ConnectedSocket,
  Message,
  OnConnect,
  OnDisconnect,
  OnDisconnecting,
  Portal,
  SubscribeMessage
} from 'socketwise'

@Portal()
export class MessagePortal {
  @OnConnect()
  public onConnect(): void {
    console.log('Connected.')
  }

  @OnDisconnecting()
  public onDisconnecting(): void {
    console.log('Disconnecting...')
  }

  @OnDisconnect()
  public onDisconnect(): void {
    console.log('Disconnected.')
  }

  @SubscribeMessage('save')
  public onSave(@ConnectedSocket() socket: Socket, @Message() message: string): void {
    console.log('Received message:', message)
    socket.emit('message_saved')
  }
}
```

2. Create a file called `index.ts`

```ts
import { Socketwise } from 'socketwise'
import { MessagePortal } from './message.portal'

new Socketwise({
  port: 3000,
  portals: [MessagePortal]
})
```

3. Now you can send `save` message from your client application using <a href="https://github.com/socketio/socket.io-client">socket.io-client</a> package.

# More examples

## Loading all portals by suffix

By specifying the suffix of your portal files, you can load all portals from anywhere in your project.

```ts
import { Socketwise } from 'socketwise'

new Socketwise({
  port: 3000,
  portals: '*.portal.ts'
})
```

## Loading all middlewares by suffix

By specifying the suffix of your middleware files, you can load all middlewares from anywhere in your project.

```ts
import { Socketwise } from 'socketwise'

new Socketwise({
  port: 3000,
  portals: '*.portal.ts',
  middlewares: '*.middleware.ts'
})
```

## Handling connection event

You can handle connection event with `@OnConnect()` decorator. In this example `onConnect` method will be called once new client connected.

```ts
import { Portal, OnConnect } from 'socketwise'

@Portal()
export class MessagePortal {
  @OnConnect()
  public onConnect(): void {
    console.log('Connected.')
  }
}
```

## Handling disconnecting event

You can handle disconnecting event with `@OnDisconnecting()` decorator. In this example `onDisconnecting` method will be called when the client is disconnecting.

```ts
import { Portal, OnDisconnecting } from 'socketwise'

@Portal()
export class MessagePortal {
  @OnDisconnecting()
  public onDisconnecting(): void {
    console.log('Disconnecting...')
  }
}
```

## Handling disconnected event

You can handle disconnected event with `@OnDisconnect()` decorator. In this example `onDisconnect` method will be called when the client is disconnected.

```ts
import { Portal, OnDisconnect } from 'socketwise'

@Portal()
export class MessagePortal {
  @OnDisconnect()
  public onDisconnect(): void {
    console.log('Disconnected.')
  }
}
```

## @ConnectedSocket() decorator

You can get connected socket instance with using `@ConnectedSocket()` decorator.

```ts
import { Socket } from 'socket.io'
import { Portal, SubscribeMessage } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@ConnectedSocket() socket: Socket): void {
    socket.emit('message_saved')
  }
}
```

## @Message() decorator

You can get received message body with using `@Message()` decorator.

```ts
import { Portal, SubscribeMessage, Message } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@Message() message: unknown): void {
    console.log('Received message:', message)
  }
}
```

## @MessageAck() decorator

You can get received message ack with using `@MessageAck()` decorator.

```ts
import { Portal, SubscribeMessage, Message, MessageAck } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@Message() message: unknown, @MessageAck() ack: Function): void {
    console.log('Received message:', message)
    ack('callback value')
  }
}
```

> Note: ack should be the last parameter in the emit function; otherwise, it will be null.

## @SocketId() decorator

You can get connected client id with using `@SocketId()` decorator.

```ts
import { Portal, SubscribeMessage, SocketId } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@SocketId() socketId: string): void {
    console.log('Socket id:', socketId)
  }
}
```

## @SocketIO() decorator

You can get connected socket.io instance with using `@SocketIO()` decorator.

```ts
import { Server } from 'socket.io'
import { Portal, SubscribeMessage, SocketIO } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@SocketIO() io: Server): void {}
}
```

## @SocketQueryParam() decorator

You can get received query parameter with using `@SocketQueryParam()` decorator.

```ts
import { Portal, SubscribeMessage, SocketQueryParam } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@SocketQueryParam('token') token: string): void {
    console.log('authorization token from query parameter:', token)
  }
}
```

## @SocketRequest() decorator

You can get request object of socket with using `@SocketRequest()` decorator.

```ts
import { IncomingMessage } from 'http'
import { Portal, SubscribeMessage, SocketRequest } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@SocketRequest() request: IncomingMessage): void {
    console.log('request object:', request)
  }
}
```

## @SocketRooms() decorator

You can get rooms object of socket with using `@SocketRooms()` decorator.

```ts
import { Portal, SubscribeMessage, SocketRooms } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  public onSave(@SocketRooms() rooms: Set<Object>): void {
    console.log('socket rooms:', rooms)
  }
}
```

## @EmitOnSuccess() decorator

You can send message back to client after method execution with using `@EmitOnSuccess()` decorator.

```ts
import { Portal, SubscribeMessage, EmitOnSuccess } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  @EmitOnSuccess('message_saved')
  public onSave(): void {
    // after executing this method, the 'message_saved' message will be sent back to the client
  }
}
```

If you return something, it will be returned in the emitted message data:

```ts
import { Portal, SubscribeMessage, EmitOnSuccess } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  @EmitOnSuccess('message_saved')
  public onSave(): Record<string, unknown> {
    // after executing this method, the 'message_saved' message will be sent back to the client with message object
    return {
      id: 10,
      content: 'message saved successfully'
    }
  }
}
```

## @EmitOnFail() decorator

You have the ability to manage which message will be sent if an error or exception occurs during execution with using `@EmitOnFail()` decorator.

```ts
import { Portal, SubscribeMessage, EmitOnSuccess, EmitOnFail } from 'socketwise'

@Portal()
export class MessagePortal {
  @SubscribeMessage('save')
  @EmitOnSuccess('message_saved')
  @EmitOnFail('custom_save_error', { message: 'custom error message' })
  @EmitOnFail('save_error')
  public onSave(): Record<string, unknown> {
    if (true === true) {
      throw new Error('Error! True is equal to true')
    }
    return {
      id: 10,
      content: 'message saved successfully'
    }
  }
}
```

After execution of this method `save_error` message will be sent to the client with `Error! True is equal to true` error message and `custom_save_error` message also will be sent to the client with `{ message: 'custom error message' }` message object.

# Using socket.io namespaces

## Using namespaces

To exclusively listen to messages within a spesific namespace, you can mark a portal with namespace:

```ts
import { Portal, SubscribeMessage } from 'socketwise'

@Portal('/users')
export class UserPortal {
  @SubscribeMessage('create')
  public onCreate(): void {}
}
```

Also you can use dynamic namespace:

```ts
import { Portal, SubscribeMessage } from 'socketwise'

@Portal('/users/:userId')
export class UserPortal {
  @SubscribeMessage('create')
  public onCreate(): void {}
}
```

## @NamespaceParams() decorator

You can get dynamic namespace params with using `@NamespaceParams()` decorator.

```ts
import { Portal, SubscribeMessage, NamespaceParams } from 'socketwise'

@Portal('/users/:userId')
export class UserPortal {
  @SubscribeMessage('create')
  public onCreate(@NamespaceParams() params: Record<string, string>): void {
    console.log('Namespace params:', params)
    // for instance, if the userId is 12, the params object will be this: { userId: '12' }
  }
}
```

## @NamespaceParam() decorator

You can get spesific dynamic namespace param with using `@NamespaceParam()` decorator.

```ts
import { Portal, SubscribeMessage, NamespaceParam } from 'socketwise'

@Portal('/users/:userId')
export class UserPortal {
  @SubscribeMessage('create')
  public onCreate(@NamespaceParam('userId') userId: string): void {
    console.log('User id:', userId)
  }
}
```

# Using middlewares

Middlewares refer to functions that are provided to the `socketIo.use` method. They enable you to establish a set of instructions that will run every time a client connects to the server. You can create your own middlewares using the `@Middleware()` decorator like below:

```ts
import { Socket } from 'socket.io'
import { Middleware, SocketIONextFunc, SocketwiseMiddleware } from 'socketwise'

@Middleware()
export class AuthorizationMiddleware implements SocketwiseMiddleware {
  public use(socket: Socket, next: SocketIONextFunc): void {
    console.log('check authorization...')
    next()
  }
}
```

You have the option to restrict middlewares to namespaces by specifying a `string`, `RegExp` or `Array<string | RegExp>` for parameter of the `@Middleware()` decorator.

```ts
import { Socket } from 'socket.io'
import { Middleware, SocketIONextFunc, SocketwiseMiddleware } from 'socketwise'

@Middleware('/users')
export class AuthorizationMiddleware implements SocketwiseMiddleware {
  public use(socket: Socket, next: SocketIONextFunc): void {
    console.log('check authorization...')
    next()
  }
}
```

# Creating instance of class from message

If you provide a class type for a parameter decorated with `@Message()`, socketwise will use the <a href="https://github.com/typestack/class-transformer">class-transformer</a> to construct an instance of the designated class type using the data received within the message. To deactivate this functionality, you should indicate `{ useClassTransformer: false }` within the SocketwiseOptions when creating a server.

```ts
import { Portal, SubscribeMessage, Message } from 'socketwise'

class User {
  private name!: string
  private surname!: string

  public getFullName(): string {
    return this.name + ' ' + this.surname
  }
}

@Portal()
export class UserPortal {
  @SubscribeMessage('save')
  public onSave(@Message() user: User): void {
    console.log('Full name:', user.getFullName())
  }
}
```

# Using dependency injection

Socketwise uses [MagnoDI](https://github.com/canccevik/magnodi) as its built-in DI container and exposes it to users. You can use this container to inject your services into your portals and middlewares.

Let's take a look at how to use it by creating a service:

```ts
import { Injectable } from 'socketwise'

@Injectable()
export class LoggerService {
  public log(message: string): void {
    console.log(message)
  }
}
```

> Note: To register our service with the container, we need to mark it with the `@Injectable()` decorator.

Afterwards, let's inject this service into our portal:

```ts
@Portal()
export class MessagePortal {
  constructor(private readonly loggerService: LoggerService) {}

  // portal events...
}
```

# Contributing

1. Fork this repository.
2. Create a new branch with feature name.
3. Create your feature.
4. Commit and set commit message with feature name.
5. Push your code to your fork repository.
6. Create pull request.

# License

Socketwise is [MIT licensed](https://github.com/canccevik/socketwise/blob/master/LICENSE).
