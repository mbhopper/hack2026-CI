import { useEffect, useRef } from 'react'

interface PixelSpriteProps {
  sprite: HTMLCanvasElement
  /** Во сколько раз увеличить, целое число */
  scale: number
  label: string
  className?: string
}

/** Спрайт из пиксельной карты, увеличенный без размытия */
export function PixelSprite({ sprite, scale, label, className }: PixelSpriteProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, sprite.width, sprite.height)
    ctx.drawImage(sprite, 0, 0)
  }, [sprite])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={className}
      width={sprite.width}
      height={sprite.height}
      style={{ width: sprite.width * scale, height: sprite.height * scale, imageRendering: 'pixelated' }}
    />
  )
}
