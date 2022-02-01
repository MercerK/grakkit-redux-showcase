import { EntityId, AnyAction } from '@reduxjs/toolkit'
import throttle from 'lodash/throttle'
import { setFileData } from '../util/fileReader'
import { PlayerItemState, PlayersSlice } from './player'
import { RootState } from './store'

const { addJoiningPlayer, removeLeavingPlayer, updateStat } = PlayersSlice.actions

const savingActions = [updateStat]

const save = throttle((state: PlayerItemState, playerId: EntityId) => {
  setFileData('players', playerId.toString(), state)
}, 2000)

export const playerStateOnDispatch = (state: RootState, action: AnyAction) => {
  if (typeof action.type === 'string') {
    if (action.type.startsWith('players/')) {
      for (const savingAction of savingActions) {
        if (savingAction.match(action)) {
          const playerState = state.players.entities[action.payload.id]

          if (!playerState) return

          save(playerState, action.payload.id)
        }
      }
    }
  }
}

export const playerStateOnLoad = () => {
  return PlayersSlice.getInitialState()
}
