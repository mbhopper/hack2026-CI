import { vignette } from '../lighting.ts'
import { metal } from '../palette.ts'
import { H, OUTLINE, W, cached, drawNumber, fill, offscreen, rng } from '../pixels.ts'
import { garageClues } from '../story.ts'
import { block, ceilingLamp } from './draw.ts'
import type { Location } from './location.ts'

const WALL_BOTTOM = 62

function drawGarage() {
  const { canvas, ctx } = offscreen(W, H)

  // задняя стена с панелями
  fill(ctx, '#1a2228', 0, 0, W, WALL_BOTTOM)
  for (let x = 0; x < W; x += 40) {
    fill(ctx, '#151c21', x, 0, 1, WALL_BOTTOM)
    fill(ctx, '#202a31', x + 1, 0, 1, WALL_BOTTOM)
  }
  fill(ctx, OUTLINE, 0, WALL_BOTTOM, W, 1)
  fill(ctx, metal.base, 0, WALL_BOTTOM + 1, W, 3)
  fill(ctx, metal.light, 0, WALL_BOTTOM + 1, W, 1)

  // табло команды
  fill(ctx, OUTLINE, 135, 11, 50, 30)
  fill(ctx, '#c62a2f', 136, 12, 48, 28)
  fill(ctx, '#e04848', 136, 12, 48, 1)
  fill(ctx, '#8f1f24', 136, 39, 48, 1)
  drawNumber(ctx, '7', 154, 16, '#f2f2f2', 4)

  // перфопанель с инструментами
  fill(ctx, OUTLINE, 19, 13, 54, 32)
  fill(ctx, metal.base, 20, 14, 52, 30)
  for (let y = 17; y < 42; y += 4) for (let x = 22; x < 72; x += 4) fill(ctx, metal.dark, x, y, 1, 1)
  fill(ctx, metal.shine, 26, 18, 2, 14)
  fill(ctx, metal.shine, 25, 18, 4, 2)
  fill(ctx, '#c62a2f', 36, 20, 7, 4)
  fill(ctx, metal.dark, 38, 24, 3, 9)
  fill(ctx, '#e8c43a', 50, 18, 3, 12)
  fill(ctx, metal.shine, 60, 19, 2, 16)

  // график смены: четыре фамилии, четыре подписи
  fill(ctx, OUTLINE, 215, 9, 39, 45)
  fill(ctx, '#d8dcd4', 216, 10, 37, 43)
  fill(ctx, '#b8bdb5', 252, 11, 1, 42)
  fill(ctx, '#b8bdb5', 217, 52, 36, 1)
  fill(ctx, '#c62a2f', 216, 10, 37, 4)
  fill(ctx, OUTLINE, 233, 7, 3, 3)
  for (let row = 0; row < 4; row++) {
    const y = 19 + row * 8
    fill(ctx, metal.lighter, 219, y, 13, 1)
    fill(ctx, metal.lighter, 219, y + 2, 9, 1)
    ;[0, -1, 1, 0, -1, 1, 1, -1, 0, 1].forEach((dy, i) => fill(ctx, '#3d5a8f', 236 + i, y + 1 + dy, 1, 1))
  }

  // пол бокса
  fill(ctx, '#20272d', 0, WALL_BOTTOM + 4, W, H - WALL_BOTTOM - 4)
  for (let y = WALL_BOTTOM + 24; y < H; y += 24) fill(ctx, '#1c2328', 0, y, W, 1)
  for (let x = 20; x < W; x += 40) fill(ctx, '#1c2328', x, WALL_BOTTOM + 4, 1, H)

  // пустое место болида: жёлтая разметка и следы шин
  const bay = { x: 112, y: 88, w: 96, h: 66 }
  fill(ctx, '#c9a227', bay.x, bay.y, bay.w, 2)
  fill(ctx, '#c9a227', bay.x, bay.y + bay.h - 2, bay.w, 2)
  fill(ctx, '#c9a227', bay.x, bay.y, 2, bay.h)
  fill(ctx, '#c9a227', bay.x + bay.w - 2, bay.y, 2, bay.h)
  drawNumber(ctx, '7', 154, 112, '#2c343b', 4)
  const marks = rng(4)
  for (let i = 0; i < 18; i++) fill(ctx, '#181e23', bay.x + 10 + marks() * 76, bay.y + 8 + marks() * 50, 6, 1)

  // красные тумбы у левой стены
  block(ctx, 8, 66, 42, 34, 6, { top: '#c62a2f', front: '#8f1f24', shade: '#6f2020' })
  for (let y = 78; y < 98; y += 6) {
    fill(ctx, '#6f2020', 10, y, 38, 1)
    fill(ctx, metal.shine, 25, y + 2, 8, 1)
  }

  // шины в стопках у правой стены
  for (const [x, y] of [
    [276, 72],
    [296, 78],
  ]) {
    for (let i = 3; i >= 0; i--) {
      const ty = y + i * 5
      fill(ctx, OUTLINE, x - 1, ty - 1, 18, 9)
      fill(ctx, '#1a1d22', x, ty, 16, 7)
      fill(ctx, '#3a4048', x, ty, 16, 2)
      fill(ctx, '#e8c43a', x + 2, ty + 4, 12, 1)
    }
    fill(ctx, OUTLINE, x + 5, y + 1, 6, 2)
  }

  // корзина с комбинезоном без бейджа под графиком
  block(ctx, 258, 66, 18, 14, 3, { top: '#4a3a26', front: '#6b5a3a', shade: '#4a3a26' })
  for (let x = 260; x < 274; x += 3) fill(ctx, '#4a3a26', x, 70, 1, 9)
  fill(ctx, '#c62a2f', 260, 63, 12, 4)
  fill(ctx, '#e04848', 260, 63, 5, 1)
  fill(ctx, OUTLINE, 272, 64, 1, 3)

  // свет
  for (const x of [60, 160, 260]) ceilingLamp(ctx, x, 124)
  vignette(ctx)
  return canvas
}

export const garage: Location = {
  id: 'garage',
  title: 'Бокс №7',
  lead: 'Здесь болид №7 стоял на пит-стопе. Осмотрите стены и всё, что оставила команда.',
  background: () => cached('location-garage', drawGarage),
  walkable: [
    { x: 54, y: 70, w: 198, h: 104 },
    { x: 8, y: 106, w: 46, h: 68 },
    { x: 252, y: 98, w: 62, h: 76 },
  ],
  start: { x: 160, y: 168, dir: 'up' },
  clues: garageClues,
  rain: false,
}
