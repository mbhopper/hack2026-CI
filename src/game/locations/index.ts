import { topicKey } from '../dialogues.ts'
import { crashSite } from './crashSite.ts'
import { garage } from './garage.ts'
import type { Location, LocationId, Npc } from './location.ts'
import { vipBox } from './vipBox.ts'

export type { Location, LocationId, Npc, Point, Rect } from './location.ts'
export { distanceToRect, isWalkable } from './location.ts'

/** Порядок кнопок в меню локаций */
export const locations: Location[] = [crashSite, garage, vipBox]

export function findLocation(id: string | undefined): Location | undefined {
  return locations.find((location) => location.id === (id as LocationId))
}

/** Со свидетелем всё обсудили: заданы все его вопросы */
export const npcDone = (npc: Npc, asked: string[]) => npc.topics.every((topic) => asked.includes(topicKey(npc.id, topic.id)))

/** Сколько дел в локации сделано: улики плюс разговор, если есть с кем поговорить */
export function locationProgress(location: Location, examined: string[], asked: string[]) {
  const found = location.clues.filter((clue) => examined.includes(clue.id)).length
  const talked = location.npc && npcDone(location.npc, asked) ? 1 : 0
  return { found: found + talked, total: location.clues.length + (location.npc ? 1 : 0) }
}

/** Всё осмотрено и со всеми поговорили — можно к подозреваемым */
export const investigationDone = (examined: string[], asked: string[]) =>
  locations.every((location) => {
    const { found, total } = locationProgress(location, examined, asked)
    return found === total
  })
