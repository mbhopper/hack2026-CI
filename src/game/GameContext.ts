import { createContext } from 'react'
import type { GameAction, GameState } from './state.ts'

export interface GameContextValue {
  state: GameState
  dispatch(action: GameAction): void
}

export const GameContext = createContext<GameContextValue | null>(null)
