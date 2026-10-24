import type { Direction } from '../characters.ts'
import type { Topic } from '../dialogues.ts'
import type { TrackId } from '../music.ts'
import type { Clue } from '../story.ts'

/** Прямоугольник в пикселях сцены 320×180 */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Point {
  x: number
  y: number
}

export type LocationId = 'crash-site' | 'garage' | 'vip-box'

export interface Location {
  id: LocationId
  title: string
  lead: string
  /** Адрес PNG или функция, которая рисует фон 320×180 */
  background: string | (() => HTMLCanvasElement)
  /** Где могут стоять ноги детектива; объединение прямоугольников */
  walkable: Rect[]
  start: Point & { dir: Direction }
  clues: Clue[]
  rain: boolean
  /** Фоновый трек локации */
  music: TrackId
  /** С кем в локации можно поговорить */
  npc?: Npc
}

/** Свидетель в локации: стоит на месте, с ним говорят, как на допросе */
export interface Npc {
  /** Ключ для заданных вопросов (topicKey) */
  id: string
  name: string
  /** Подойдя сюда, можно заговорить */
  area: Rect
  topics: Topic<string>[]
  portraits: Record<string, string>
  idleMood: string
  /** Лист кадров */
  sheet: string
  /** Рисует свидетеля поверх фона; talking — сейчас идёт разговор */
  draw(ctx: CanvasRenderingContext2D, sheet: HTMLImageElement, time: number, talking: boolean): void
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
