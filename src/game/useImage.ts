import { useEffect, useState } from 'react'

/** Загружает картинку для canvas; пока не загрузилась или src пустой — null */
export function useImage(src: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setImage(img)
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  return image
}
