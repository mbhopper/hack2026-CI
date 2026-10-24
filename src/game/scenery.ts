/**
 * Процедурные фоны 320×180. Всё рисуется прямоугольниками по целым
 * пикселям, поэтому после масштабирования остаётся «пиксельным».
 */

export const W = 320
export const H = 180

/** Высота горизонта: ниже начинается трибуна, ещё ниже — асфальт */
export const TRACK_TOP = 118
export const TRACK_BOTTOM = 162
export const LANE_NEAR = 146
export const LANE_FAR = 130

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

export function offscreen(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return { canvas, ctx: canvas.getContext('2d')! }
}

const cache = new Map<string, HTMLCanvasElement>()
function cached(key: string, make: () => HTMLCanvasElement) {
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

/** Небо полосами: ночью тёмно-зелёное, днём через два дня — серое и пасмурное */
export function drawSky(ctx: CanvasRenderingContext2D, mood: 'night' | 'overcast' = 'night') {
  const bands =
    mood === 'night'
      ? ['#070a09', '#0a0f0d', '#0d1411', '#111a16', '#16211c']
      : ['#3a4146', '#454c51', '#50585c', '#5c6467', '#677073']
  bands.forEach((color, i) => fill(ctx, color, 0, i * 12, W, 12))
  fill(ctx, bands[bands.length - 1], 0, 60, W, 60)

  if (mood === 'night') {
    const rand = rng(7)
    for (let i = 0; i < 40; i++) {
      fill(ctx, rand() > 0.7 ? '#a9b3ae' : '#4a5550', rand() * W, rand() * 34, 1, 1)
    }
    // прожекторы над трибуной
    for (const x of [40, 150, 260]) {
      fill(ctx, '#2a332f', x, 6, 2, 30)
      fill(ctx, '#e8ece9', x - 4, 4, 10, 3)
      fill(ctx, '#f6f0c8', x - 3, 7, 8, 1)
    }
  }
}

export interface StandsOptions {
  /** Сидит ли спонсор в VIP-ложе */
  sponsorInBox: boolean
  /** Есть ли на трибунах зрители (через два дня — пусто) */
  crowd: boolean
}

export const STANDS_WIDTH = 640
const STANDS_HEIGHT = 78
/** Где на ленте трибуны стоит VIP-ложа */
export const VIP_X = 430

function buildStands({ sponsorInBox, crowd }: StandsOptions) {
  const { canvas, ctx } = offscreen(STANDS_WIDTH, STANDS_HEIGHT)
  const rand = rng(crowd ? 42 : 43)
  const crowdColors = ['#c62a2f', '#e8ece9', '#1d3a78', '#e8c43a', '#3dbf72', '#e07b2e', '#a9b3ae', '#7a4bb0']

  // крыша и опоры
  fill(ctx, '#1b2420', 0, 0, STANDS_WIDTH, 6)
  fill(ctx, '#2a3530', 0, 6, STANDS_WIDTH, 2)
  for (let x = 8; x < STANDS_WIDTH; x += 64) fill(ctx, '#1b2420', x, 8, 3, STANDS_HEIGHT - 8)

  // ряды сидений
  for (let row = 0; row < 8; row++) {
    const y = 12 + row * 8
    fill(ctx, row % 2 ? '#1a2320' : '#1e2925', 0, y, STANDS_WIDTH, 8)
    for (let x = 2; x < STANDS_WIDTH; x += 4) {
      if (x > VIP_X - 6 && x < VIP_X + 70 && row < 5) continue
      fill(ctx, '#2c3833', x, y + 5, 3, 2)
      if (crowd && rand() > 0.12) {
        const color = crowdColors[Math.floor(rand() * crowdColors.length)]
        fill(ctx, '#e2b48c', x, y + 1, 2, 2)
        fill(ctx, color, x, y + 3, 3, 3)
      }
    }
  }

  // VIP-ложа: стекло, табличка, кресла
  fill(ctx, '#0f1513', VIP_X - 6, 10, 76, 44)
  fill(ctx, '#3dbf72', VIP_X - 6, 10, 76, 2)
  fill(ctx, '#22302a', VIP_X - 4, 14, 72, 36)
  fill(ctx, '#2f4a3f', VIP_X - 2, 16, 68, 20)
  fill(ctx, '#e8ece9', VIP_X + 22, 12, 20, 1)
  for (let i = 0; i < 5; i++) {
    const x = VIP_X + 4 + i * 12
    fill(ctx, '#5a1d22', x, 38, 8, 8)
    fill(ctx, '#8f1f24', x, 38, 8, 3)
    // гости ложи; среднее кресло — спонсора
    const isSponsorSeat = i === 2
    if (crowd && (!isSponsorSeat || sponsorInBox)) {
      fill(ctx, isSponsorSeat ? '#c9cfcc' : '#3a2618', x + 2, 30, 4, 2)
      fill(ctx, '#e2b48c', x + 2, 32, 4, 3)
      fill(ctx, isSponsorSeat ? '#2a2f36' : '#4a5550', x + 1, 35, 6, 6)
      if (isSponsorSeat) fill(ctx, '#d93a3a', x + 4, 35, 1, 4)
    }
  }
  fill(ctx, '#0f1513', VIP_X - 6, 46, 76, 6)

  // нижний бортик трибуны
  fill(ctx, '#2a3530', 0, STANDS_HEIGHT - 4, STANDS_WIDTH, 4)
  return canvas
}

export function standsCanvas(options: StandsOptions) {
  return cached(`stands-${options.sponsorInBox}-${options.crowd}`, () => buildStands(options))
}

function wrap(value: number, size: number) {
  return ((value % size) + size) % size
}

/** Рисует повторяющуюся ленту со сдвигом */
function drawStrip(ctx: CanvasRenderingContext2D, image: HTMLCanvasElement, offset: number, y: number) {
  for (let x = -Math.round(wrap(offset, image.width)); x < W; x += image.width) ctx.drawImage(image, x, y)
}

function buildBarrier() {
  const { canvas, ctx } = offscreen(64, 14)
  fill(ctx, '#3d4a44', 0, 0, 64, 14)
  fill(ctx, '#a9b3ae', 0, 2, 64, 2)
  fill(ctx, '#6f7a75', 0, 4, 64, 1)
  fill(ctx, '#a9b3ae', 0, 7, 64, 2)
  fill(ctx, '#6f7a75', 0, 9, 64, 1)
  for (let x = 0; x < 64; x += 16) fill(ctx, '#1f2a25', x, 0, 2, 14)
  // рекламный щит
  fill(ctx, '#e8ece9', 22, 1, 20, 12)
  fill(ctx, '#3dbf72', 24, 3, 16, 3)
  fill(ctx, '#2a8a52', 24, 7, 10, 2)
  return canvas
}

function buildAsphalt() {
  const { canvas, ctx } = offscreen(64, TRACK_BOTTOM - TRACK_TOP + 18)
  const rand = rng(11)
  fill(ctx, '#2b302f', 0, 0, 64, TRACK_BOTTOM - TRACK_TOP)
  for (let i = 0; i < 60; i++) fill(ctx, rand() > 0.5 ? '#333938' : '#252a29', rand() * 64, rand() * 44, 2, 1)
  // разметка посередине
  fill(ctx, '#a9b3ae', 6, 21, 20, 1)
  // поребрик
  for (let x = 0; x < 64; x += 16) {
    fill(ctx, '#d93a3a', x, 44, 8, 4)
    fill(ctx, '#e8ece9', x + 8, 44, 8, 4)
  }
  // трава
  fill(ctx, '#1d3a24', 0, 48, 64, 14)
  for (let i = 0; i < 30; i++) fill(ctx, '#27502f', rand() * 64, 48 + rand() * 14, 1, 2)
  return canvas
}

export interface SideTrackOptions {
  /** Сдвиг камеры по трассе в пикселях */
  scroll: number
  stands: StandsOptions
  mood?: 'night' | 'overcast'
}

/** Трасса сбоку с параллаксом: небо стоит, трибуна едет медленно, асфальт — быстро */
export function drawSideTrack(ctx: CanvasRenderingContext2D, { scroll, stands, mood = 'night' }: SideTrackOptions) {
  drawSky(ctx, mood)
  drawStrip(ctx, standsCanvas(stands), scroll * 0.35, 34)
  drawStrip(ctx, cached('barrier', buildBarrier), scroll, TRACK_TOP - 14)
  drawStrip(ctx, cached('asphalt', buildAsphalt), scroll, TRACK_TOP)
}

/** Чёрно-белая клетка финишной линии поперёк асфальта */
export function drawFinishLine(ctx: CanvasRenderingContext2D, x: number) {
  for (let y = TRACK_TOP; y < TRACK_BOTTOM; y += 4) {
    const odd = ((y - TRACK_TOP) / 4) % 2
    fill(ctx, odd ? '#e8ece9' : '#0b0f0e', x, y, 4, 4)
    fill(ctx, odd ? '#0b0f0e' : '#e8ece9', x + 4, y, 4, 4)
  }
  // арка
  fill(ctx, '#1f2a25', x - 2, TRACK_TOP - 40, 2, 40)
  fill(ctx, '#1f2a25', x + 8, TRACK_TOP - 40, 2, 40)
  fill(ctx, '#1f2a25', x - 2, TRACK_TOP - 44, 12, 4)
}

/** Овал трассы сверху (сцены 1 и 3) */
export const OVAL = { cx: 160, cy: 96, rx: 118, ry: 56 }

export function ovalPoint(angle: number) {
  return {
    x: Math.round(OVAL.cx + Math.cos(angle) * OVAL.rx),
    y: Math.round(OVAL.cy + Math.sin(angle) * OVAL.ry),
  }
}

function buildTopTrack() {
  const { canvas, ctx } = offscreen(W, H)
  fill(ctx, '#0d1411', 0, 0, W, H)
  const rand = rng(3)
  for (let i = 0; i < 120; i++) fill(ctx, '#132019', rand() * W, rand() * H, 2, 2)

  const plot = (thickness: number, color: string) => {
    for (let a = 0; a < Math.PI * 2; a += 0.003) {
      const p = ovalPoint(a)
      fill(ctx, color, p.x - thickness / 2, p.y - thickness / 2, thickness, thickness)
    }
  }
  plot(16, '#e8ece9')
  plot(14, '#2b302f')
  plot(1, '#4a5550')

  // пит-лейн и боксы внизу
  fill(ctx, '#1f2a25', 110, 158, 100, 8)
  for (let x = 112; x < 208; x += 10) fill(ctx, '#3a4a43', x, 160, 8, 4)
  // трибуна сверху
  fill(ctx, '#1e2925', 100, 18, 120, 12)
  for (let x = 102; x < 218; x += 3) fill(ctx, '#3a4a43', x, 21, 2, 2)
  // старт-финиш
  for (let y = 145; y < 160; y += 2) {
    fill(ctx, '#e8ece9', 160, y, 2, 2)
    fill(ctx, '#0b0f0e', 162, y, 2, 2)
  }
  return canvas
}

export function drawTopTrack(ctx: CanvasRenderingContext2D) {
  ctx.drawImage(cached('top-track', buildTopTrack), 0, 0)
}

/** Бокс команды №7 сбоку: стена, стойки с инструментами, табло */
export function drawPitBox(ctx: CanvasRenderingContext2D, light = 1) {
  fill(ctx, '#121917', 0, 0, W, H)
  fill(ctx, '#1b2420', 0, 20, W, 96)
  // лампы
  for (let x = 30; x < W; x += 70) {
    fill(ctx, '#2a3530', x, 14, 30, 4)
    fill(ctx, light > 0.5 ? '#f6f0c8' : '#6f7a75', x + 2, 18, 26, 2)
  }
  // табло команды
  fill(ctx, '#0b0f0e', 128, 30, 64, 24)
  fill(ctx, '#c62a2f', 130, 32, 60, 20)
  fill(ctx, '#e8ece9', 152, 35, 16, 3)
  fill(ctx, '#e8ece9', 164, 38, 4, 3)
  fill(ctx, '#e8ece9', 162, 41, 4, 3)
  fill(ctx, '#e8ece9', 160, 44, 4, 3)
  fill(ctx, '#e8ece9', 158, 47, 4, 3)
  // стойки с инструментами
  for (const x of [20, 262]) {
    fill(ctx, '#2a3530', x, 50, 40, 56)
    for (let y = 56; y < 104; y += 12) {
      fill(ctx, '#3d4a44', x + 2, y, 36, 2)
      fill(ctx, '#a9b3ae', x + 6, y - 5, 2, 5)
      fill(ctx, '#d93a3a', x + 14, y - 4, 6, 4)
      fill(ctx, '#e8c43a', x + 26, y - 6, 3, 6)
    }
  }
  // шины в стопках
  for (const x of [72, 236]) {
    for (let i = 0; i < 3; i++) {
      fill(ctx, '#1a1d22', x, 86 + i * 8, 14, 7)
      fill(ctx, '#e8c43a', x + 2, 89 + i * 8, 10, 1)
    }
  }
  // пол и разметка пит-лейна
  fill(ctx, '#3a403f', 0, 116, W, 64)
  fill(ctx, '#e8c43a', 0, 116, W, 2)
  for (let x = 0; x < W; x += 24) fill(ctx, '#4a5150', x, 150, 12, 2)
}

/**
 * Пит-уолл крупным планом: инженер между двумя мониторами, на правом
 * телеметрия болида №7 лезет в красное. Рисуем в половинном разрешении
 * и растягиваем ровно вдвое — так пиксели инженера и мониторов одного размера.
 */
export function drawPitWall(
  ctx: CanvasRenderingContext2D,
  telemetry: number,
  time: number,
  engineer: HTMLCanvasElement,
) {
  const { canvas, ctx: half } = offscreen(W / 2, H / 2)
  fill(half, '#0a0f0d', 0, 0, 160, 90)
  fill(half, '#151d1a', 0, 62, 160, 28)
  fill(half, '#1f2a25', 0, 61, 160, 2)

  const screens = [
    { x: 10, live: false },
    { x: 106, live: true },
  ]
  for (const { x, live } of screens) {
    fill(half, '#2a3530', x - 1, 11, 46, 32)
    fill(half, '#06100b', x, 12, 44, 30)
    fill(half, '#1f2a25', x + 20, 43, 4, 6)
    for (let gx = 0; gx < 44; gx++) {
      const base = live ? telemetry : 0.4
      const value = base * (gx / 44) + Math.sin((gx + time * 20 + x) / 4) * 0.05
      const gy = 12 + 27 - Math.round(Math.min(1, Math.max(0, value)) * 25)
      fill(half, live && telemetry > 0.75 ? '#e04848' : '#3dbf72', x + gx, gy, 1, 1)
    }
  }

  // инженер сидит за столом, стол закрывает ему пояс
  half.drawImage(engineer, 72, 36)
  fill(half, '#2a3530', 6, 48, 148, 4)
  fill(half, '#1b2420', 12, 52, 2, 9)
  fill(half, '#1b2420', 146, 52, 2, 9)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(canvas, 0, 0, W, H)
}

/** Косые струи дождя поверх кадра */
export function drawRain(ctx: CanvasRenderingContext2D, time: number, density = 70) {
  const rand = rng(99)
  for (let i = 0; i < density; i++) {
    const speed = 160 + rand() * 80
    const x = wrap(rand() * W - time * speed * 0.3, W)
    const y = wrap(rand() * H + time * speed, H)
    fill(ctx, 'rgba(169,179,174,0.45)', x, y, 1, 4)
  }
}

/** Стартовые огни: lit — сколько из пяти горит */
export function drawStartLights(ctx: CanvasRenderingContext2D, x: number, y: number, lit: number) {
  fill(ctx, '#0b0f0e', x, y, 62, 16)
  fill(ctx, '#1f2a25', x + 30, y - 20, 2, 20)
  for (let i = 0; i < 5; i++) {
    fill(ctx, '#2a1415', x + 3 + i * 12, y + 3, 9, 10)
    if (i < lit) {
      fill(ctx, '#e04848', x + 3 + i * 12, y + 3, 9, 10)
      fill(ctx, '#ff9b8f', x + 5 + i * 12, y + 5, 3, 3)
    }
  }
}
