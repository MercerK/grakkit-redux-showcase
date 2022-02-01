import { AnyAction, configureStore } from '@reduxjs/toolkit'
import { broadcastWebsocket } from '../websocket'
import { playerStateOnDispatch, playerStateOnLoad } from './persistence'
import { PlayersSlice } from './player'

export type RootState = ReturnType<ReturnType<typeof initializeStore>['getState']>

function initializeStore(data: any) {
  return configureStore({
    reducer: {
      players: PlayersSlice.reducer,
    },
    devTools: false,
    preloadedState: data as any,
  })
}

export const store = initializeStore({
  players: playerStateOnLoad(),
})

export const dispatch = (action: AnyAction) => {
  store.dispatch(action)

  playerStateOnDispatch(store.getState(), action)

  setTimeout(() => {
    broadcastWebsocket(
      JSON.stringify({
        type: 'ACTION',
        action: { action, timestamp: Date.now() },
        payload: store.getState(),
      })
    )
  })
}
