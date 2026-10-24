import { routes } from '../routes.ts'
import type { GameState } from './state.ts'
import { cluesAt, type LocationId } from './story.ts'

/** Все ли улики найдены в этом месте */
export function locationDone(state: GameState, location: LocationId) {
  return cluesAt(location).every((clue) => state.found.includes(clue.id))
}

/** Осмотр закончен — можно переходить к подозреваемым */
export function inspectionDone(state: GameState) {
  return locationDone(state, 'track')
}

/** Куда вернуть игрока, который нажал «Продолжить» */
export function resumeRoute(state: GameState) {
  if (!state.introSeen) return routes.intro
  if (!inspectionDone(state)) return routes.track
  return routes.suspects
}
