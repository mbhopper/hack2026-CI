import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth.ts'
import { GameContext } from './GameContext.ts'
import {
  forgetState,
  hasState,
  initialState,
  loadState,
  reducer,
  saveState,
  type GameAction,
  type GameState,
} from './state.ts'

/** Состояние вместе с тем, чьё оно: так не сохраним чужой или пустой прогресс */
interface Owned {
  owner: string | null
  game: GameState
}

type OwnedAction = GameAction | { type: 'switch'; owner: string | null }

function ownedReducer(current: Owned, action: OwnedAction): Owned {
  if (action.type === 'switch') {
    // гость завёл аккаунт или вошёл в пустой: забираем его расследование с собой
    if (current.owner?.startsWith('guest-') && action.owner && !hasState(action.owner)) {
      forgetState(current.owner)
      return { owner: action.owner, game: current.game }
    }
    return { owner: action.owner, game: action.owner ? loadState(action.owner) : initialState }
  }
  return { ...current, game: reducer(current.game, action) }
}

/** Хранит расследование текущего игрока и сохраняет каждое изменение */
export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [owned, dispatchOwned] = useReducer(ownedReducer, userId, (owner) => ({
    owner,
    game: owner ? loadState(owner) : initialState,
  }))

  if (owned.owner !== userId) dispatchOwned({ type: 'switch', owner: userId })

  useEffect(() => {
    if (owned.owner) saveState(owned.owner, owned.game)
  }, [owned])

  const value = useMemo(
    () => ({ state: owned.game, dispatch: dispatchOwned as (action: GameAction) => void }),
    [owned.game],
  )
  return <GameContext value={value}>{children}</GameContext>
}
