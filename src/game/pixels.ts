/**
 * Общие инструменты пиксель-арта: offscreen-холсты с кешем, заливка по целым
 * пикселям, автоматический контур и смешивание цветов палитры.
 */

export const OUTLINE = '#0b0f0e'

/** Размер кадра всех сцен; canvas масштабируется целым множителем */
export const W = 320
export const H = 180

export function offscreen(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return { canvas, ctx }
}

const cache = new Map<string, HTMLCanvasElement>()

/** Собирает холст один раз и дальше отдаёт его из кеша */
export function cached(key: string, make: () => HTMLCanvasElement): HTMLCanvasElement {
  let hit = cache.get(key)
  if (!hit) {
    hit = make()
    cache.set(key, hit)
  }
  return hit
}

export function fill(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

/** Детерминированный генератор случайных чисел: один seed — один узор */
export function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Смешивает два цвета #rrggbb; amount = 0 — первый цвет, 1 — второй */
export function mix(from: string, to: string, amount: number): string {
  const a = parseInt(from.slice(1), 16)
  const b = parseInt(to.slice(1), 16)
  const channel = (shift: number) => {
    const x = (a >> shift) & 255
    const y = (b >> shift) & 255
    return Math.round(x + (y - x) * amount)
  }
  return `#${((channel(16) << 16) | (channel(8) << 8) | channel(0)).toString(16).padStart(6, '0')}`
}

/** Обводит силуэт тёмным контуром в один пиксель по четырём соседям */
export function outline(canvas: HTMLCanvasElement, color = OUTLINE) {
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  const image = ctx.getImageData(0, 0, width, height)
  const alpha = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height ? image.data[(y * width + x) * 4 + 3] : 0
  ctx.fillStyle = color
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha(x, y) > 0) continue
      if (alpha(x - 1, y) || alpha(x + 1, y) || alpha(x, y - 1) || alpha(x, y + 1)) ctx.fillRect(x, y, 1, 1)
    }
  }
  return canvas
}

/** Пиксельный шрифт 3×5 для номеров и табло */
const DIGITS: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '.#.', '.#.', '.#.'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
}

export function drawNumber(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size = 1) {
  ctx.fillStyle = color
  ;[...text].forEach((char, i) => {
    DIGITS[char]?.forEach((row, ry) => {
      for (let rx = 0; rx < 3; rx++) {
        if (row[rx] === '#') ctx.fillRect(x + (i * 4 + rx) * size, y + ry * size, size, size)
      }
    })
  })
}

/** Буквы 5×5 для надписей на документах и печати */
const LETTERS: Record<string, string[]> = {
  А: ['.###.', '#...#', '#####', '#...#', '#...#'],
  Д: ['.###.', '.#.#.', '.#.#.', '#####', '#...#'],
  Е: ['#####', '#....', '####.', '#....', '#####'],
  К: ['#...#', '#..#.', '###..', '#..#.', '#...#'],
  Л: ['.####', '.#..#', '.#..#', '.#..#', '##..#'],
  О: ['.###.', '#...#', '#...#', '#...#', '.###.'],
  Р: ['####.', '#...#', '####.', '#....', '#....'],
  С: ['.####', '#....', '#....', '#....', '.####'],
  Т: ['#####', '..#..', '..#..', '..#..', '..#..'],
  Ы: ['#...#', '#...#', '###.#', '#.#.#', '###.#'],
  '№': ['#..#.', '##.#.', '#.##.', '#..#.', '#..##'],
}

/** Ширина строки в пикселях до увеличения */
export function textWidth(text: string): number {
  return [...text].reduce((sum, char) => sum + (char === ' ' ? 3 : (LETTERS[char] ?? DIGITS[char])?.[0].length ?? 0) + 1, -1)
}

/** Надпись заглавными буквами пиксельным шрифтом */
export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size = 1) {
  ctx.fillStyle = color
  let cursor = x
  for (const char of text) {
    const glyph = LETTERS[char] ?? DIGITS[char]
    if (!glyph) {
      cursor += 4 * size
      continue
    }
    glyph.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] === '#') ctx.fillRect(cursor + rx * size, y + ry * size, size, size)
      }
    })
    cursor += (glyph[0].length + 1) * size
  }
}
