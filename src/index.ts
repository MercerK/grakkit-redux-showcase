import { initializeAutoReload } from 'grakkit-boilerplate-util'
import { initializeDemo } from './demo'
import { startWebsocket, stopWebsocket } from './websocket'

initializeDemo()
initializeAutoReload({
  onStop: () => {
    stopWebsocket()
  },
})

startWebsocket()
