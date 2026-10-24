import { glow, vignette } from '../lighting.ts'
import { kerb, lamp, metal, night } from '../palette.ts'
import { H, OUTLINE, W, cached, fill, offscreen, rng } from '../pixels.ts'
import { vipBoxClues } from '../story.ts'
import { block, ceilingLamp } from './draw.ts'
import type { Location } from './location.ts'

const WINDOW_BOTTOM = 62
const SEATS = 5
const SPONSOR_SEAT = 2

/** Кресло со спины: высокая спинка, подлокотники, тень справа */
function armchair(ctx: CanvasRenderingContext2D, x: number, y: number) {
  fill(ctx, OUTLINE, x - 1, y - 1, 32, 26)
  fill(ctx, '#7a1f24', x, y, 30, 24)
  fill(ctx, '#a8343a', x, y, 30, 3)
  fill(ctx, '#a8343a', x, y, 2, 24)
  fill(ctx, '#5a161a', x + 26, y + 3, 4, 21)
  fill(ctx, OUTLINE, x + 4, y + 5, 22, 1)
  fill(ctx, '#6a1a1f', x + 4, y + 6, 22, 18)
}

function drawVipBox() {
  const { canvas, ctx } = offscreen(W, H)

  // панорамное окно на ночную трассу
  night.sky.forEach((color, i) => fill(ctx, color, 0, i * 6, W, 6))
  fill(ctx, night.sky[4], 0, 30, W, 32)
  const stars = rng(31)
  for (let i = 0; i < 20; i++) fill(ctx, stars() > 0.8 ? night.starBright : night.star, stars() * W, stars() * 20, 1, 1)
  fill(ctx, '#0b1114', 0, 30, W, 14)
  const crowd = rng(12)
  for (let i = 0; i < 60; i++) fill(ctx, crowd() > 0.7 ? lamp.amber : '#2b333b', crowd() * W, 32 + crowd() * 10, 1, 1)
  fill(ctx, '#1d252c', 0, 44, W, 12)
  for (let x = 0; x < W; x += 16) {
    fill(ctx, kerb.red, x, 56, 8, 2)
    fill(ctx, kerb.white, x + 8, 56, 8, 2)
  }
  fill(ctx, '#12201a', 0, 58, W, 4)
  for (const x of [50, 160, 270]) {
    glow(ctx, x, 10, 16, 8)
    fill(ctx, lamp.warm, x - 4, 9, 9, 2)
  }
  ctx.fillStyle = 'rgba(200, 220, 230, 0.07)'
  for (let i = 0; i < 40; i++) {
    ctx.fillRect(30 + i, i * 1.5, 4, 2)
    ctx.fillRect(200 + i, i * 1.5, 3, 2)
  }
  for (let x = 0; x <= W; x += 80) {
    fill(ctx, OUTLINE, x - 2, 0, 5, WINDOW_BOTTOM)
    fill(ctx, metal.base, x - 1, 0, 3, WINDOW_BOTTOM)
    fill(ctx, metal.light, x - 1, 0, 1, WINDOW_BOTTOM)
  }

  // подоконник
  fill(ctx, OUTLINE, 0, WINDOW_BOTTOM, W, 1)
  fill(ctx, '#5a3b25', 0, WINDOW_BOTTOM + 1, W, 3)
  fill(ctx, '#7a5236', 0, WINDOW_BOTTOM + 1, W, 1)
  fill(ctx, '#3a2618', 0, WINDOW_BOTTOM + 4, W, 3)

  // ковёр
  fill(ctx, '#2a1a1e', 0, WINDOW_BOTTOM + 7, W, H - WINDOW_BOTTOM - 7)
  for (let y = WINDOW_BOTTOM + 12; y < H; y += 8) {
    for (let x = (y / 8) % 2 ? 4 : 8; x < W; x += 8) fill(ctx, '#33202a', x, y, 2, 2)
  }

  // ряд кресел у окна; кресло спонсора с латунной табличкой
  for (let i = 0; i < SEATS; i++) {
    const x = 22 + i * 58
    armchair(ctx, x, 76)
    if (i === SPONSOR_SEAT) {
      fill(ctx, OUTLINE, x + 9, 82, 12, 5)
      fill(ctx, '#c9a227', x + 10, 83, 10, 3)
      fill(ctx, '#e8c47a', x + 10, 83, 10, 1)
    }
  }

  // барная стойка слева
  block(ctx, 6, 110, 52, 58, 8, { top: '#7a5236', front: '#5a3b25', shade: '#3a2618' })
  for (let x = 12; x < 52; x += 9) {
    fill(ctx, OUTLINE, x - 1, 101, 5, 11)
    fill(ctx, x % 2 ? '#2a5a3a' : '#5a1d22', x, 102, 3, 9)
    fill(ctx, '#e8ece9', x, 103, 1, 3)
  }

  // столик с бокалами справа
  block(ctx, 268, 118, 34, 22, 8, { top: '#7a5236', front: '#5a3b25', shade: '#3a2618' })
  for (const x of [274, 284, 294]) {
    fill(ctx, OUTLINE, x - 1, 112, 5, 8)
    fill(ctx, '#c8ced0', x, 113, 3, 3)
    fill(ctx, '#e8c47a', x, 114, 3, 2)
    fill(ctx, '#c8ced0', x + 1, 116, 1, 3)
  }

  for (const x of [80, 240]) ceilingLamp(ctx, x, 136)
  glow(ctx, 22 + SPONSOR_SEAT * 58 + 15, 90, 26, 16)
  vignette(ctx)
  return canvas
}

export const vipBox: Location = {
  id: 'vip-box',
  title: 'VIP-ложа',
  lead: 'Ложа спонсора над финишной прямой. Отсюда видно всю трассу.',
  background: () => cached('location-vip-box', drawVipBox),
  walkable: [
    { x: 64, y: 108, w: 198, h: 66 },
    { x: 262, y: 146, w: 50, h: 28 },
    { x: 262, y: 104, w: 50, h: 8 },
  ],
  start: { x: 160, y: 168, dir: 'up' },
  clues: vipBoxClues,
  rain: false,
}
