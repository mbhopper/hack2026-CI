/** Общие приёмы для фонов локаций в ракурсе ¾ */
import { glow } from '../lighting.ts'
import { lamp, metal } from '../palette.ts'
import { OUTLINE, fill } from '../pixels.ts'

/**
 * Предмет в ¾: сверху светлая крышка высотой depth, ниже передняя грань.
 * Контур по краю, тень на правой грани.
 */
export function block(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number,
  colors: { top: string; front: string; shade: string },
) {
  fill(ctx, OUTLINE, x - 1, y - 1, w + 2, h + 2)
  fill(ctx, colors.top, x, y, w, depth)
  fill(ctx, colors.front, x, y + depth, w, h - depth)
  fill(ctx, colors.shade, x + w - 2, y + depth, 2, h - depth)
  fill(ctx, OUTLINE, x, y + depth, w, 1)
}

/** Лампа под потолком и тёплое пятно от неё на полу */
export function ceilingLamp(ctx: CanvasRenderingContext2D, x: number, floorY: number) {
  glow(ctx, x, floorY, 46, 18)
  fill(ctx, OUTLINE, x - 11, 1, 22, 5)
  fill(ctx, metal.base, x - 10, 1, 20, 3)
  fill(ctx, lamp.warm, x - 8, 4, 16, 1)
  fill(ctx, lamp.core, x - 8, 4, 4, 1)
}
