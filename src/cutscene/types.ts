import type { GameAudio } from '../game/audio.ts'

/** Что React рисует поверх canvas в текущий момент */
export interface Overlay {
  /** Крупная надпись по центру: дисклеймер, название, титры */
  caption?: { text: string; size: 'xl' | 'md' }
  /** Реплика по рации */
  subtitle?: { speaker?: string; text: string }
  /** Подпись к звуку для тех, кто смотрит без звука */
  sound?: string
  /** Счётчик круга сверху */
  lap?: string
  /** Спидометр и температура в сцене разгона */
  hud?: { speed: number; heat: number }
  /** Подпись под фотографией с финиша */
  photo?: string
}

/** Общие звуковые циклы, которые живут дольше одной сцены */
export interface SharedLoops {
  crowd?: { stop(): void }
  wind?: { stop(): void }
  rain?: { stop(): void }
}

export interface DrawEnv {
  ctx: CanvasRenderingContext2D
  /** Секунды от начала сцены */
  t: number
  /** Номер кадра — для анимации колёс и мерцания */
  frame: number
  reducedMotion: boolean
}

export interface Cue {
  /** Секунда от начала сцены */
  at: number
  run(audio: GameAudio, loops: SharedLoops): void
}

export interface Scene {
  id: string
  duration: number
  draw(env: DrawEnv): void
  overlay?(t: number, playerName: string): Overlay
  cues?: Cue[]
  /** Амплитуда тряски камеры в пикселях */
  shake?(t: number): number
  /** Белая вспышка поверх кадра, 0..1 */
  flash?(t: number): number
}
