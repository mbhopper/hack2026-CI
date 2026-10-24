import { useEffect, useRef } from 'react'
import { H, W, drawPitBox, fill, offscreen } from '../game/scenery.ts'
import { carSprite, outfits, personSprite } from '../game/sprites.ts'

const PIT_LANE = 150
const crew = [120, 186, 104, 200]

/**
 * Разгадка: пит-стоп в 14:38 ещё раз. Пятый механик у кокпита
 * поднимает голову — под кепкой седой спонсор с VIP-браслетом.
 */
function drawPit(ctx: CanvasRenderingContext2D, t: number) {
  drawPitBox(ctx, 0.6)
  const revealed = t > 2.4
  const fifth = revealed ? personSprite('sponsor', outfits.mechanic7) : personSprite('mechanicFifth', outfits.mechanic7)
  ctx.drawImage(fifth, 150, PIT_LANE - 24 - (revealed ? 6 : 3))
  ctx.drawImage(carSprite('car7'), 136, PIT_LANE - 12)
  for (const x of crew) ctx.drawImage(personSprite('mechanic', outfits.mechanic7), x, PIT_LANE - 24)

  // всё, кроме пятого, уходит в тень
  if (t > 1.2) {
    ctx.globalAlpha = Math.min(0.7, (t - 1.2) * 0.6)
    fill(ctx, '#000', 0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.drawImage(fifth, 150, PIT_LANE - 24 - (revealed ? 6 : 3))
  }
  // вспышка фотоаппарата в момент разоблачения
  if (t > 2.4 && t < 2.7) {
    ctx.globalAlpha = 1 - (t - 2.4) / 0.3
    fill(ctx, '#fff', 0, 0, W, H)
    ctx.globalAlpha = 1
  }
}

let pit: ReturnType<typeof offscreen> | null = null

/** Крупно: камера вдвое ближе к болиду */
function draw(ctx: CanvasRenderingContext2D, t: number) {
  pit ??= offscreen(W, H)
  drawPit(pit.ctx, t)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(pit.canvas, 80, 90, W / 2, H / 2, 0, 0, W, H)
}

export function RevealScene() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(ctx, 4)
      return
    }
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      const t = (now - start) / 1000
      draw(ctx, t)
      if (t < 4) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="reveal">
      <canvas ref={ref} width={W} height={H} className="reveal__canvas" role="img" aria-label="Пятый механик у кокпита оказывается спонсором" />
      <span className="reveal__time">14:38</span>
    </div>
  )
}
