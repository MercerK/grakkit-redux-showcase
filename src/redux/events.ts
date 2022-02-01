import { obePlayer } from '@grakkit/types-paper'
import { EntityId } from '@reduxjs/toolkit'
import { getFileData, setFileData } from '../util/fileReader'
import { getPlayerItemInitialState, PlayerItemState, PlayersSlice } from './player'
import { dispatch, store } from './store'

type PlayerArg = obePlayer | EntityId
const toId = (arg: PlayerArg) => (typeof arg === 'object' ? arg.getUniqueId().toString() : arg)
const FOLDER_PLAYER = 'players'

function loadPlayer(player: obePlayer) {
  const file = getFileData(FOLDER_PLAYER, toId(player).toString())
  const initialState = getPlayerItemInitialState(toId(player), player.getName())
  const data: PlayerItemState = {
    ...initialState,
    ...file.data,

    stats: {
      ...initialState.stats,
      ...(file.data?.stats ?? {}),
      joins: file.data?.stats ? file.data?.stats.joins + 1 : 1,
    },
  }

  dispatch(PlayersSlice.actions.addJoiningPlayer(data))
}

export function initializeReduxPlayerEvents() {
  function onInitialize() {
    const players = core.server.getOnlinePlayers()

    for (const player of players) {
      setTimeout(() => {
        loadPlayer(player)
      }, 10)
    }
  }

  function onPlayerJoin() {
    core.event('org.bukkit.event.player.PlayerJoinEvent', (event) => {
      loadPlayer(event.getPlayer())

      setTimeout(() => {
        const player = event.getPlayer()
        const msg = (s: string) => player.sendMessage(s as any)

        const playerData = store.getState().players.entities[toId(player)]
        if (!playerData) return
        const { joins, deaths, blocksMined, kills, quits } = playerData.stats

        msg('§6Welcome to the Redux Showcase. Below are your stats')
        msg(`§2Blocks Mined:§r ${blocksMined}`)
        msg(`§2Kills:§r ${kills}`)
        msg(`§2Deaths:§r ${deaths}`)
        msg(`§2Joins:§r ${joins}`)
        msg(`§2Quits:§r ${quits}`)
      }, 3000)
    })
  }

  function onPlayerQuit() {
    core.event('org.bukkit.event.player.PlayerQuitEvent', (event) => {
      const player = event.getPlayer()
      const playerData = store.getState().players.entities[toId(player)]

      if (!playerData) return
      setFileData<PlayerItemState>(FOLDER_PLAYER, toId(player).toString(), {
        ...playerData,
        stats: {
          ...playerData.stats,
          quits: playerData.stats.quits + 1,
        },
      })

      setTimeout(() => {
        dispatch(PlayersSlice.actions.removeLeavingPlayer(toId(player)))
      }, 500)
    })
  }

  function onPlayerMine() {
    core.event('org.bukkit.event.block.BlockBreakEvent', (event) => {
      const player = event.getPlayer()
      if (!player) return

      const playerData = store.getState().players.entities[toId(player)]
      if (!playerData) return

      dispatch(
        PlayersSlice.actions.updateStat({
          id: toId(player),
          stats: {
            ...playerData.stats,
            blocksMined: playerData.stats.blocksMined + 1,
          },
        })
      )
    })
  }

  function onPlayerKill() {
    core.event('org.bukkit.event.entity.EntityDeathEvent', (event) => {
      const killer = event.getEntity().getKiller()
      if (!killer) return
      if (!(killer instanceof core.type('org.bukkit.entity.Player'))) return

      const playerData = store.getState().players.entities[toId(killer)]
      if (!playerData) return

      dispatch(
        PlayersSlice.actions.updateStat({
          id: toId(killer),
          stats: {
            ...playerData.stats,
            kills: playerData.stats.kills + 1,
          },
        })
      )
    })
  }

  function onPlayerDeath() {
    core.event('org.bukkit.event.entity.PlayerDeathEvent', (event) => {
      const entity = event.getEntity()
      if (!(entity instanceof core.type('org.bukkit.entity.Player'))) return

      const playerData = store.getState().players.entities[toId(entity)]
      if (!playerData) return

      dispatch(
        PlayersSlice.actions.updateStat({
          id: toId(entity),
          stats: {
            ...playerData.stats,
            deaths: playerData.stats.deaths + 1,
          },
        })
      )
    })
  }

  onInitialize()
  onPlayerJoin()
  onPlayerQuit()

  // The below events are not optimal.
  // It'll dispatch many events when the player is mining or killing a lot.
  // You'll want to debounce or throttle the player event and dispatch a
  // single action with the final count.
  onPlayerMine()
  onPlayerKill()
  onPlayerDeath()
}
