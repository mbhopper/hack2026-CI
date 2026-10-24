import { carSprite } from './sprites.ts'
import { LANE_FAR, VIP_X, drawSideTrack, fill } from './scenery.ts'

/** Где на кадре 320×180 лежит снимок вместе с белой рамкой */
export const PHOTO_FRAME = { x: 62, y: 22, w: 196, h: 116 }

/**
 * Фото с финиша: болид №22 на фоне трибуны, в VIP-ложе пустует кресло
 * спонсора. Одна и та же картинка в катсцене и в блокноте детектива.
 */
export function drawFinishPhoto(ctx: CanvasRenderingContext2D) {
  const { x, y, w, h } = PHOTO_FRAME
  fill(ctx, '#e8ece9', x, y, w, h)
  ctx.save()
  ctx.beginPath()
  ctx.rect(x + 4, y + 4, w - 8, h - 16)
  ctx.clip()
  // камера смотрит на трибуну так, чтобы VIP-ложа попала в кадр
  ctx.translate(0, -8)
  drawSideTrack(ctx, { scroll: (VIP_X - 140) / 0.35, stands: { sponsorInBox: false, crowd: true } })
  ctx.drawImage(carSprite('car22', 0), 118, LANE_FAR + 2 - 12)
  ctx.restore()
}

/** Снимок, вырезанный из кадра, — для блокнота */
export function finishPhotoCanvas() {
  const scene = document.createElement('canvas')
  scene.width = 320
  scene.height = 180
  drawFinishPhoto(scene.getContext('2d')!)
  const { x, y, w, h } = PHOTO_FRAME
  const photo = document.createElement('canvas')
  photo.width = w
  photo.height = h
  photo.getContext('2d')!.drawImage(scene, x, y, w, h, 0, 0, w, h)
  return photo
}
