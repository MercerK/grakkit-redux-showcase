import WebSocket from 'ws'
import socketClusterClient from 'socketcluster-client'
import ws from 'ws'

let globalCtx = {
  state: {} as any,
}

const WebSocketInit = () => {
  const ctx = {
    ws: undefined as undefined | WebSocket,
    socket: undefined as undefined | any,
  }

  function start() {
    if (ctx.ws) return

    const ws = new WebSocket('ws://localhost:10209', {
      perMessageDeflate: false,
    })

    ws.on('error', () => {
      //
    })

    ws.on('open', function open() {
      ctx.ws = ws
      ws.send(JSON.stringify({ client: 'hello' }))
    })

    ws.on('close', () => {
      ctx.ws = undefined
      setTimeout(() => {
        console.log('Not connected. Trying again')
        start()
      }, 1000)
    })

    ws.on('message', function message(data) {
      if (!ctx.socket) return
      const parsed = JSON.parse(data as any)
      console.log('received: %s', parsed.type)

      if (parsed.type === 'STATE') {
        globalCtx.state = parsed.state
        ctx.socket.emit('log', {
          type: 'INIT',
          payload: parsed.state,
          id: ctx.socket.id,
          name: 'test',
        })
      } else if (parsed.type === 'ACTION') {
        ctx.socket.emit(ctx.socket.id ? 'log' : 'log-noid', {
          ...parsed,
          id: ctx.socket.id,
          name: 'test',
        })
      } else {
        ctx.socket.emit(ctx.socket.id ? 'log' : 'log-noid', {
          type: 'ACTION',
          action: { action: parsed, timestamp: Date.now() },
          id: ctx.socket.id,
          name: 'test',
        })
      }
    })
  }

  return {
    start,
    send: (data: any) => {
      if (!ctx.ws) return

      ctx.ws.send(data)
    },
    registerCluster: (socket) => {
      ctx.socket = socket
    },
    ws,
  }
}

const ClusterSocketInit = () => {
  const ctx = {
    ws: undefined as any,
  }

  const socket = socketClusterClient.create({
    hostname: 'localhost',
    port: 8000,
  })

  socket.on('connect', (status) => {
    socket.emit('login', 'master', (error, channelName) => {
      if (error) {
        console.log(error)
        return
      }

      console.log('channelName', channelName)
      let channel = socket.subscribe(channelName)
      channel.watch(handleMessages)
      socket.on(channelName, handleMessages)
    })
  })

  socket.on('disconnect', (code) => {
    console.warn('Socket disconnected with code', code)
  })
  socket.on('error', (error) => {
    console.warn('Socket error', error)
  })

  function handleMessages(message) {
    if (!ctx.ws) return

    if (message.type === 'START') {
      ctx.ws.send(JSON.stringify({ type: 'STATE' }))
    }
  }

  return {
    registerWs: (ws) => {
      ctx.ws = ws
    },
    socket,
  }
}

async function main(resolve: any) {
  const ws = WebSocketInit()
  const cluster = ClusterSocketInit()

  ws.registerCluster(cluster.socket)
  cluster.registerWs(ws.ws)

  try {
    ws.start()
  } catch (err) {
    console.log('got it')
  }
}

new Promise((resolve) => main(resolve))
  .then(() => {
    //
  })
  .catch((err) => {
    console.log(err)
  })
