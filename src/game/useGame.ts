import { use } from 'react'
import { GameContext } from './GameContext.ts'

export function useGame() {
  const context = use(GameContext)
  if (!context) throw new Error('useGame вызван вне GameProvider')
  return context
}
