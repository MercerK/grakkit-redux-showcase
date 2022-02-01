import { createEntityAdapter, createSlice, EntityId } from '@reduxjs/toolkit'

export interface PlayerItemState {
  stats: {
    blocksMined: number
    kills: number
    deaths: number
    joins: number
    quits: number
  }
  id: EntityId
  name: string
}

export const getPlayerItemInitialState = (id: EntityId, name: string): PlayerItemState => {
  return {
    id,
    name,
    stats: {
      blocksMined: 0,
      kills: 0,
      deaths: 0,
      joins: 0,
      quits: 0,
    },
  }
}

export const PlayerAdapter = createEntityAdapter<PlayerItemState>({
  selectId: (entity) => entity.id,
})

export const PlayersSlice = createSlice({
  name: 'Players',
  initialState: PlayerAdapter.getInitialState(),
  reducers: {
    addJoiningPlayer: PlayerAdapter.setOne,
    removeLeavingPlayer: PlayerAdapter.removeOne,
    updateStat: (state, action: { payload: { id: EntityId; stats: Partial<PlayerItemState['stats']> } }) => {
      let player = state.entities[action.payload['id']]

      if (!player) {
        PlayerAdapter.setOne(state, getPlayerItemInitialState(action.payload.id, 'unknown'))
        player = state.entities[action.payload['id']]!
      }

      player.stats = {
        ...player.stats,
        ...action.payload.stats,
      }
    },
  },
})
