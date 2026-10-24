import { drawCrashSite } from './crashSite.ts'
import { H, W, fill, offscreen, rng } from './scenery.ts'
import type { LocationId } from './story.ts'

/**
 * Места для осмотра. Метки улик в story.ts лежат поверх этих картинок,
 * поэтому координаты предметов здесь и там должны совпадать.
 */

export type DrawScene = (ctx: CanvasRenderingContext2D, time: number, animate: boolean) => void

/** Бокс №7 через два дня: пусто, свет приглушён, на столе остался ноутбук телеметрии */
export function drawPitboxScene(ctx: CanvasRenderingContext2D, time: number, animate: boolean) {
  fill(ctx, '#0e1412', 0, 0, W, H)
  fill(ctx, '#18201d', 0, 18, W, 98)
  // вертикальные панели стены
  for (let x = 0; x < W; x += 40) fill(ctx, '#151c19', x, 18, 1, 98)

  // лампы: одна мигает, остальные выключены
  const flicker = animate && Math.sin(time * 13) + Math.sin(time * 7.3) > 1.2
  for (let x = 30; x < W; x += 70) {
    fill(ctx, '#2a3530', x, 10, 30, 4)
    fill(ctx, x === 170 && !flicker ? '#d8d2a8' : '#4a5550', x + 2, 14, 26, 2)
  }

  // табло команды с цифрой 7
  fill(ctx, '#0b0f0e', 128, 22, 64, 24)
  fill(ctx, '#8e2125', 130, 24, 60, 20)
  fill(ctx, '#d8dcd9', 152, 27, 16, 3)
  fill(ctx, '#d8dcd9', 164, 30, 4, 3)
  fill(ctx, '#d8dcd9', 162, 33, 4, 3)
  fill(ctx, '#d8dcd9', 160, 36, 4, 3)
  fill(ctx, '#d8dcd9', 158, 39, 4, 3)

  // доска с графиком смены
  fill(ctx, '#3a2618', 20, 36, 40, 44)
  fill(ctx, '#5a3b25', 22, 38, 36, 40)
  fill(ctx, '#e8ece9', 25, 41, 30, 34)
  fill(ctx, '#c62a2f', 25, 41, 30, 4)
  for (let row = 0; row < 4; row++) {
    const y = 49 + row * 6
    fill(ctx, '#6f7a75', 27, y, 14, 1)
    // подпись: короткая волна синей ручкой
    fill(ctx, '#1d3a78', 44, y - 1, 3, 1)
    fill(ctx, '#1d3a78', 47, y, 3, 1)
    fill(ctx, '#1d3a78', 50, y - 1, 3, 1)
  }
  fill(ctx, '#e8c43a', 38, 36, 4, 3) // кнопка

  // стеллаж с инструментами справа
  fill(ctx, '#2a3530', 262, 44, 40, 40)
  for (let y = 52; y < 84; y += 10) {
    fill(ctx, '#3d4a44', 264, y, 36, 2)
    fill(ctx, '#a9b3ae', 268, y - 5, 2, 5)
    fill(ctx, '#d93a3a', 276, y - 4, 6, 4)
    fill(ctx, '#e8c43a', 288, y - 6, 3, 6)
  }

  // пол и разметка
  fill(ctx, '#2f3534', 0, 116, W, 64)
  fill(ctx, '#a8902f', 0, 116, W, 2)
  for (let x = 0; x < W; x += 24) fill(ctx, '#3b4241', x, 156, 12, 2)
  // масляное пятно
  fill(ctx, '#202524', 96, 140, 30, 4)
  fill(ctx, '#202524', 102, 138, 18, 8)

  // стопка шин
  for (let i = 0; i < 3; i++) {
    fill(ctx, '#15181c', 72, 92 + i * 8, 16, 7)
    fill(ctx, '#a8902f', 74, 95 + i * 8, 12, 1)
  }

  // стол и ноутбук телеметрии
  fill(ctx, '#3d4a44', 116, 104, 88, 4)
  fill(ctx, '#2a3530', 120, 108, 3, 14)
  fill(ctx, '#2a3530', 197, 108, 3, 14)
  fill(ctx, '#1f2a25', 138, 100, 44, 4) // клавиатура
  fill(ctx, '#2a3530', 140, 74, 40, 27) // крышка
  fill(ctx, '#06100b', 142, 76, 36, 22) // экран
  // график скорости: ровно, потом рывок вверх и полка на максимуме
  for (let gx = 0; gx < 34; gx++) {
    const gy = gx < 14 ? 92 - Math.round(gx / 4) : gx < 18 ? 88 - (gx - 14) * 3 : 78
    fill(ctx, gx < 14 ? '#3dbf72' : '#e04848', 143 + gx, gy, 1, 1)
  }
  if (!animate || Math.floor(time * 2) % 2) fill(ctx, '#e04848', 170, 94, 6, 2) // мигающий индикатор
  fill(ctx, '#e8ece9', 186, 98, 10, 6) // кружка
  fill(ctx, '#c62a2f', 188, 100, 6, 2)

  // корзина для белья с лишним комбинезоном
  fill(ctx, '#5a3b25', 248, 98, 38, 22)
  for (let x = 250; x < 286; x += 4) fill(ctx, '#3a2618', x, 100, 1, 18)
  fill(ctx, '#3a2618', 248, 108, 38, 1)
  fill(ctx, '#c62a2f', 252, 92, 26, 8) // ткань комбинезона
  fill(ctx, '#f2f2f2', 258, 93, 12, 2) // белая полоса
  fill(ctx, '#c62a2f', 280, 96, 5, 16) // свисающий рукав
  fill(ctx, '#f2f2f2', 280, 110, 5, 2)
  fill(ctx, '#e8c43a', 264, 96, 5, 2) // краешек браслета

  // лента ограждения поперёк въезда в бокс
  for (let x = 0; x < W; x += 4) fill(ctx, (x / 4) % 2 ? '#e8c43a' : '#0b0f0e', x, 126, 4, 1)
}

let glass: ReturnType<typeof offscreen> | null = null
function viewThroughGlass(time: number, animate: boolean) {
  glass ??= offscreen(W, H)
  drawCrashSite(glass.ctx, animate ? time : 0, animate)
  return glass.canvas
}

/** VIP-ложа: стеклянная стена над трассой, пять кресел, турникет у входа */
export function drawVipScene(ctx: CanvasRenderingContext2D, time: number, animate: boolean) {
  fill(ctx, '#1a1214', 0, 0, W, H)
  fill(ctx, '#24181b', 0, 10, W, 110)

  // окно на трассу: видно место аварии
  ctx.drawImage(viewThroughGlass(time, animate), 30, 92, 240, 64, 60, 14, 240, 64)
  fill(ctx, 'rgba(160,190,200,0.12)', 60, 14, 240, 64) // блик стекла
  for (const x of [60, 140, 220, 299]) fill(ctx, '#0f0a0b', x, 12, 2, 68)
  fill(ctx, '#0f0a0b', 58, 12, 244, 2)
  fill(ctx, '#3a2a2e', 56, 78, 248, 6) // подоконник

  // ковёр
  fill(ctx, '#4a1d22', 0, 120, W, 60)
  const rand = rng(5)
  for (let i = 0; i < 50; i++) fill(ctx, '#56242a', rand() * W, 120 + rand() * 60, 3, 1)
  fill(ctx, '#2a1416', 0, 118, W, 2)

  // кресла: среднее — место спонсора
  const seats = [62, 98, 134, 170, 206]
  for (const x of seats) {
    const sponsor = x === 134
    fill(ctx, '#0f0a0b', x + 2, 128, 24, 4) // тень
    fill(ctx, sponsor ? '#7a5a1a' : '#5b1d22', x, 100, 28, 18) // спинка
    fill(ctx, sponsor ? '#a07a26' : '#7a262d', x + 2, 102, 24, 14)
    fill(ctx, sponsor ? '#7a5a1a' : '#5b1d22', x - 2, 116, 32, 8) // сиденье
    fill(ctx, '#2a1416', x + 2, 124, 3, 6)
    fill(ctx, '#2a1416', x + 23, 124, 3, 6)
  }
  // на кресле спонсора: нераскрытая программка и полный бокал
  fill(ctx, '#e8ece9', 140, 113, 12, 4)
  fill(ctx, '#c62a2f', 140, 113, 12, 1)
  fill(ctx, '#d8dcd9', 156, 106, 4, 8)
  fill(ctx, '#e0c060', 156, 108, 4, 5)
  fill(ctx, '#d8dcd9', 157, 114, 2, 3)

  // турникет у входа
  fill(ctx, '#0f0a0b', 12, 40, 36, 80) // дверной проём
  fill(ctx, '#3d4a44', 18, 74, 8, 52) // тумба
  fill(ctx, '#a9b3ae', 20, 76, 4, 2)
  fill(ctx, '#06100b', 19, 82, 6, 6) // считыватель
  const green = animate ? Math.floor(time) % 4 === 0 : false
  fill(ctx, green ? '#3dbf72' : '#e04848', 21, 84, 2, 2)
  fill(ctx, '#a9b3ae', 26, 92, 18, 2) // планка
  fill(ctx, '#6f7a75', 26, 98, 14, 2)
  fill(ctx, '#3d4a44', 40, 74, 6, 52)
  // распечатка журнала на стене
  fill(ctx, '#e8ece9', 30, 60, 14, 10)
  for (let row = 0; row < 3; row++) fill(ctx, '#6f7a75', 32, 62 + row * 3, 10, 1)

  // столик с папкой документов
  fill(ctx, '#3a2a2e', 236, 112, 46, 4)
  fill(ctx, '#2a1d20', 240, 116, 3, 12)
  fill(ctx, '#2a1d20', 275, 116, 3, 12)
  fill(ctx, '#c9a35a', 242, 104, 32, 8) // папка
  fill(ctx, '#a8823e', 242, 104, 32, 2)
  fill(ctx, '#e8ece9', 246, 101, 22, 3) // торчащие листы
  fill(ctx, '#c62a2f', 262, 106, 8, 4) // печать
}

export const sceneDrawers: Record<LocationId, DrawScene> = {
  track: (ctx, time, animate) => drawCrashSite(ctx, time, animate),
  pitbox: drawPitboxScene,
  vip: drawVipScene,
}

/** Крупный план улики: кусок неподвижной сцены вокруг метки */
export function closeUp(location: LocationId, spot: { x: number; y: number; w: number; h: number }) {
  const scene = offscreen(W, H)
  sceneDrawers[location](scene.ctx, 0, false)
  const margin = 6
  const x = Math.max(0, spot.x - margin)
  const y = Math.max(0, spot.y - margin)
  const w = Math.min(W, spot.x + spot.w + margin) - x
  const h = Math.min(H, spot.y + spot.h + margin) - y
  const crop = offscreen(w, h)
  crop.ctx.drawImage(scene.canvas, x, y, w, h, 0, 0, w, h)
  return crop.canvas
}
