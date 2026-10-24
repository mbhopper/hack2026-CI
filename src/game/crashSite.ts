import { wreckSprite } from './sprites.ts'
import { TRACK_TOP, VIP_X, drawRain, drawSideTrack, fill } from './scenery.ts'

/** Сдвиг камеры, при котором VIP-ложа оказывается слева в кадре */
export const CRASH_SITE_SCROLL = Math.round((VIP_X - 60) / 0.35)

/**
 * Место аварии через два дня: пустые трибуны, обломки болида №7 у отбойника,
 * лента ограждения. Общая сцена для конца катсцены и для экрана осмотра.
 */
export function drawCrashSite(ctx: CanvasRenderingContext2D, time: number, rain = true) {
  drawSideTrack(ctx, {
    scroll: CRASH_SITE_SCROLL,
    stands: { sponsorInBox: false, crowd: false },
    mood: 'overcast',
  })

  // вмятина и царапины на отбойнике
  fill(ctx, '#1a1d22', 284, TRACK_TOP - 11, 3, 1)
  fill(ctx, '#1a1d22', 286, TRACK_TOP - 9, 14, 2)
  fill(ctx, '#1a1d22', 289, TRACK_TOP - 6, 10, 1)
  fill(ctx, '#c62a2f', 291, TRACK_TOP - 7, 7, 1)
  fill(ctx, '#c62a2f', 295, TRACK_TOP - 4, 4, 1)

  ctx.drawImage(wreckSprite(), 232, TRACK_TOP - 6)

  // лента ограждения на двух столбиках
  fill(ctx, '#1f2a25', 222, TRACK_TOP - 4, 1, 16)
  fill(ctx, '#1f2a25', 310, TRACK_TOP + 2, 1, 16)
  for (let x = 222; x < 310; x += 4) {
    const y = TRACK_TOP - 2 + Math.round((x - 222) / 15)
    fill(ctx, (x / 4) % 2 ? '#e8c43a' : '#0b0f0e', x, y, 4, 1)
  }

  if (rain) drawRain(ctx, time, 50)
}
