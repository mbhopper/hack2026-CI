import { crashSite } from './crashSite.ts'
import { garage } from './garage.ts'
import type { Location, LocationId } from './location.ts'
import { vipBox } from './vipBox.ts'

export type { Location, LocationId, Point, Rect } from './location.ts'
export { distanceToRect, isWalkable } from './location.ts'

/** Порядок кнопок в меню локаций */
export const locations: Location[] = [crashSite, garage, vipBox]

export function findLocation(id: string | undefined): Location | undefined {
  return locations.find((location) => location.id === (id as LocationId))
}

export const allClues = locations.flatMap((location) => location.clues)
