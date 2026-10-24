import detectiveSheet from '../assets/characters/detective.png'
import mechanicSheet from '../assets/characters/mechanic.png'
import pilot1Sheet from '../assets/characters/pilot1.png'
import pilot22Sheet from '../assets/characters/pilot22.png'
import sponsorSheet from '../assets/characters/sponsor.png'

/**
 * Листы ходьбы персонажей: 96×128, ячейка 32×32.
 * Строки — направления (вниз, влево, вправо, вверх), столбцы — кадры «шаг — стойка — шаг».
 */
export type Direction = 'down' | 'left' | 'right' | 'up'

export const characterSheets = {
  detective: detectiveSheet,
  pilot1: pilot1Sheet,
  pilot22: pilot22Sheet,
  mechanic: mechanicSheet,
  sponsor: sponsorSheet,
} as const

export type CharacterId = keyof typeof characterSheets

export const FRAME_SIZE = 32
/** Строка ног в кадре: по ней ставим персонажа на точку (x, y) */
const FEET_Y = 30
const ROW: Record<Direction, number> = { down: 0, left: 1, right: 2, up: 3 }
/** Порядок кадров при ходьбе; в стойке — средний кадр */
const WALK_CYCLE = [0, 1, 2, 1] as const
export const IDLE_FRAME = 1

export function walkFrame(step: number): number {
  return WALK_CYCLE[Math.floor(step) % WALK_CYCLE.length]
}

/** Рисует кадр персонажа так, что его ноги стоят в точке (x, y) */
export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  dir: Direction,
  frame: number,
  x: number,
  y: number,
) {
  const left = Math.round(x - FRAME_SIZE / 2)
  const top = Math.round(y - FEET_Y)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
  ctx.beginPath()
  ctx.ellipse(Math.round(x), Math.round(y) + 1, 9, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.drawImage(sheet, frame * FRAME_SIZE, ROW[dir] * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, left, top, FRAME_SIZE, FRAME_SIZE)
}
