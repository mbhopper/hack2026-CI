import { routes } from '../routes.ts'
import { verdict } from './accusation.ts'
import type { GameState } from './state.ts'
import { cluesAt, locations, type LocationId } from './story.ts'

/** Все ли улики найдены в этом месте */
export function locationDone(state: GameState, location: LocationId) {
  return cluesAt(location).every((clue) => state.found.includes(clue.id))
}

/** Места открываются по порядку: следующее — когда осмотрено предыдущее */
export function locationOpen(state: GameState, location: LocationId) {
  const index = locations.findIndex((place) => place.id === location)
  return index <= 0 || locationDone(state, locations[index - 1].id)
}

/** Первое место, где ещё остались улики */
export function nextLocation(state: GameState) {
  return locations.find((place) => !locationDone(state, place.id))
}

/** Осмотр закончен — можно переходить к подозреваемым */
export function inspectionDone(state: GameState) {
  return nextLocation(state) === undefined
}

/** Куда вернуть игрока, который нажал «Продолжить» */
export function resumeRoute(state: GameState) {
  if (!state.introSeen) return routes.intro
  const place = nextLocation(state)
  if (place) return routes.inspect(place.id)
  if (state.accusation && verdict(state.accusation) === 'solved') return routes.ending
  return routes.suspects
}
