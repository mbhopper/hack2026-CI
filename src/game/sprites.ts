/**
 * Пиксель-арт игры. Каждый спрайт — массив строк, один символ = один пиксель.
 * Символ `.` прозрачный, остальные берутся из палитры. В машинах и людях
 * буквы A/C/H — «слоты» цвета, их подменяем ливреей или одеждой.
 */

export type Palette = Record<string, string>

export const basePalette: Palette = {
  k: '#0b0f0e',
  d: '#1f2a25',
  g: '#34433c',
  c: '#6f7a75',
  l: '#a9b3ae',
  w: '#e8ece9',
  t: '#1a1d22',
  s: '#e2b48c',
  S: '#b07f57',
  h: '#3a2618',
  y: '#e8c43a',
  r: '#d93a3a',
  e: '#e07b2e',
  n: '#7a5a3a',
  N: '#e8ece9',
}

export interface Livery {
  number: number
  /** Основной цвет кузова */
  A: string
  /** Акцент: полоса, нос, крылья */
  C: string
  /** Шлем пилота */
  H: string
}

/** Номера и цвета болидов — см. раздел «Болиды» в плане катсцены */
export const liveries = {
  car7: { number: 7, A: '#c62a2f', C: '#f2f2f2', H: '#f2d24b' },
  car22: { number: 22, A: '#1d3a78', C: '#e8c43a', H: '#e8ece9' },
  car3: { number: 3, A: '#e07b2e', C: '#2a2f36', H: '#2a2f36' },
  car9: { number: 9, A: '#8a9299', C: '#1a1d22', H: '#d93a3a' },
  car14: { number: 14, A: '#7a4bb0', C: '#e8ece9', H: '#e8ece9' },
  car31: { number: 31, A: '#e8ece9', C: '#3dbf72', H: '#3dbf72' },
} satisfies Record<string, Livery>

export type CarId = keyof typeof liveries

/** Болид сбоку, нос смотрит вправо. Два кадра — для вращения колёс. */
const carFrames = [
  [
    'CCC',
    'CAC',
    '.A.............kkk',
    '.A............kHHHk',
    '.AAAAAAAAAAAAAkHHHHkAAAA',
    '.AAAAAAAAAAACCCCCCCCCCCCAAAAAA',
    '..AAAAAAAAAAAAANNNAAAAAAAAAAAAAAAAAA',
    '..AAAAAAAAAAAAANNNAAAAAAAAAAAAAAAAAAAAC',
    '..tttt...kkkkkkkkkkkkkkkkkkk..tttt..CCCCC',
    '.tttttt..kkkkkkkkkkkkkkkkkk..tttttt',
    '.ttlltt.....................ttlltt',
    '..tttt.......................tttt',
  ],
  [
    'CCC',
    'CAC',
    '.A.............kkk',
    '.A............kHHHk',
    '.AAAAAAAAAAAAAkHHHHkAAAA',
    '.AAAAAAAAAAACCCCCCCCCCCCAAAAAA',
    '..AAAAAAAAAAAAANNNAAAAAAAAAAAAAAAAAA',
    '..AAAAAAAAAAAAANNNAAAAAAAAAAAAAAAAAAAAC',
    '..tttt...kkkkkkkkkkkkkkkkkkk..tttt..CCCCC',
    '.tlttlt..kkkkkkkkkkkkkkkkkk..tlttlt',
    '.tttttt.....................tttttt',
    '..tttt.......................tttt',
  ],
]

const wreckRows = [
  '',
  '.................k',
  '..........A....kHk',
  '......AAA.AA..kHHk..k',
  '....AAAkAAAAAAkkkAAAA.A',
  '...AAkkAAACCCAAkAAAAAAk',
  '..AAAAkAAAAAAAANNAkAAAAkk',
  '.cAAAAAAAkAAAAAAAAAAAAkcc...c',
  '.tttttckkkkkkkkkkkkkkkcc..tt',
  'tttlltt.kkkkkkkkkkkkk....ttt',
  'tttttt',
  '.tttt',
]

/** Люди, вид спереди, 16×24. A — одежда, C — головной убор/акцент. */
const people = {
  mechanic: [
    '',
    '.....CCCCCC',
    '....CCCCCCCC',
    '...CCCCCCCCCC',
    '....ssssssss',
    '....skssssks',
    '....ssssssss',
    '.....sSSSSs',
    '......ssss',
    '...AAAAAAAAAA',
    '..AAAAwAAwAAAA',
    '..AAAAAAAAAAAA',
    '..AwwAAAAAAAAA',
    '..sAAAAAAAAAAs',
    '..sAAAAAAAAAAs',
    '...AAkkkkkkAA',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...kkkk..kkkk',
    '..kkkkk..kkkkk',
  ],
  /** «Пятый механик»: кепка ниже, глаз не видно, нет бейджа на груди */
  mechanicFifth: [
    '',
    '.....CCCCCC',
    '....CCCCCCCC',
    '....CCCCCCCC',
    '...CCCCCCCCCC',
    '....ssssssss',
    '....ssssssss',
    '.....sSSSSs',
    '......ssss',
    '...AAAAAAAAAA',
    '..AAAAwAAwAAAA',
    '..AAAAAAAAAAAA',
    '..AAAAAAAAAAAA',
    '..sAAAAAAAAAAs',
    '..sAAAAAAAAAAs',
    '...AAkkkkkkAA',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...kkkk..kkkk',
    '..kkkkk..kkkkk',
  ],
  pilot: [
    '',
    '.....hhhhhh',
    '....hhhhhhhh',
    '....hssssssh',
    '....skssssks',
    '....ssssssss',
    '.....sSSSSs',
    '......ssss',
    '...AAAAAAAAAA',
    '..AAACCCCCCAAA',
    '..AAAAAAAAAAAA',
    '..AAAAACCAAAAA',
    '..AAAAAAAAAAAA',
    '..sAAAAAAAAAAs',
    '..sCCCCCCCCCCs',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...CCCC..CCCC',
    '...kkkk..kkkk',
    '..kkkkk..kkkkk',
  ],
  sponsor: [
    '',
    '.....llllll',
    '....llllllll',
    '....lssssssl',
    '....skssssks',
    '....ssssssss',
    '.....sSSSSs',
    '......ssss',
    '...AAAwwwAAA',
    '..AAAAwrwAAAAA',
    '..AAAAwrwAAAAA',
    '..AAAAArAAAAAA',
    '..AAAAArAAAAAA',
    '..AAAAAAAAAAAA',
    '..sAAAAAAAAAAs',
    '..yAAAAAAAAAAs',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...AAAA..AAAA',
    '...kkkk..kkkk',
    '..kkkkk..kkkkk',
  ],
  engineer: [
    '',
    '.....hhhhhh',
    '...khhhhhhhhk',
    '...khssssssk',
    '...kskssssks',
    '...kssssssskk',
    '.....sSSSSs.k',
    '......ssss.kk',
    '...AAAAAAAAAA',
    '..AAAAwAAwAAAA',
    '..AAAAAAAAAAAA',
    '..AwwAAAAAAAAA',
    '..sAAAAAAAAAAs',
    '..sAAAAAAAAAAs',
  ],
  detective: [
    '.....kkkkkk',
    '....kkkkkkkk',
    '..kkkkkkkkkkkk',
    '....ssssssss',
    '....skssssks',
    '....ssssssss',
    '.....sSSSSs',
    '...CCCssssCCC',
    '..AAACCwwCCAAA',
    '..AAAACwwCAAAA',
    '..AAAAAAAAAAAA',
    '..AAAAAAkAAAAA',
    '..AAAAAAAAAAAA',
    '..sAAAAAkAAAAs',
    '..sAAkkkkkkAAs',
    '...AAAAAAAAAA',
    '...AAAAAkAAAA',
    '...AAAAAAAAAA',
    '...AAAAAAAAAA',
    '...AAAA..AAAA',
    '....ddd..ddd',
    '....ddd..ddd',
    '...kkkk..kkkk',
    '..kkkkk..kkkkk',
  ],
} satisfies Record<string, string[]>

export type PersonKind = keyof typeof people

export const outfits = {
  mechanic7: { A: '#c62a2f', C: '#8f1f24' },
  pilot22: { A: '#1d3a78', C: '#e8c43a' },
  sponsor: { A: '#2a2f36', C: '#2a2f36' },
  detective: { A: '#9c7a4f', C: '#7a5a3a' },
} satisfies Record<string, Palette>

const cache = new Map<string, HTMLCanvasElement>()

/** Собирает спрайт в offscreen-canvas. Результат кешируется по ключу. */
export function buildSprite(key: string, rows: string[], palette: Palette): HTMLCanvasElement {
  const hit = cache.get(key)
  if (hit) return hit

  const width = Math.max(...rows.map((row) => row.length))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = rows.length
  const ctx = canvas.getContext('2d')!
  const colors = { ...basePalette, ...palette }

  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = colors[row[x]]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  })

  cache.set(key, canvas)
  return canvas
}

export function carSprite(car: CarId, frame = 0) {
  const livery: Livery = liveries[car]
  return buildSprite(`car-${car}-${frame % 2}`, carFrames[frame % 2], {
    A: livery.A,
    C: livery.C,
    H: livery.H,
  })
}

export function wreckSprite() {
  const livery = liveries.car7
  return buildSprite('wreck', wreckRows, { A: livery.A, C: livery.C, H: livery.H })
}

export function personSprite(kind: PersonKind, outfit: Palette) {
  return buildSprite(`${kind}-${outfit.A}-${outfit.C}`, people[kind], outfit)
}
