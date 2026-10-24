import background from '../../assets/locations/crash-site.png'
import type { Direction } from '../characters.ts'

/** Прямоугольник в пикселях сцены 320×180 */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Location {
  background: string
  /** Где могут стоять ноги детектива; объединение прямоугольников */
  walkable: Rect[]
  start: { x: number; y: number; dir: Direction }
}

/**
 * Место аварии через два дня: статичный экран. Болид №7 врезался в отбойник
 * на выходе из правого поворота, вокруг сигнальная лента с проходом слева.
 */
export const crashSite: Location = {
  background,
  walkable: [
    { x: 6, y: 62, w: 196, h: 46 }, // прямая перед поворотом
    { x: 200, y: 74, w: 18, h: 20 }, // проход в ленте к болиду
    { x: 150, y: 100, w: 56, h: 24 }, // внутренняя часть поворота
    { x: 196, y: 124, w: 94, h: 50 }, // поворот и зона вылета ниже ленты
  ],
  start: { x: 172, y: 84, dir: 'right' },
}

export function isWalkable(location: Location, x: number, y: number): boolean {
  return location.walkable.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)
}

/** Расстояние от точки до прямоугольника (0, если точка внутри) */
export function distanceToRect(r: Rect, x: number, y: number): number {
  const dx = Math.max(r.x - x, 0, x - (r.x + r.w))
  const dy = Math.max(r.y - y, 0, y - (r.y + r.h))
  return Math.hypot(dx, dy)
}
