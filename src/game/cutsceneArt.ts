import engineer from '../assets/cutscene/engineer.png'
import crashSite from '../assets/locations/crash-site.png'
import { characterSheets } from './characters.ts'

/** Картинки катсцены. Canvas рисует их синхронно, поэтому грузим заранее. */
const sources = {
  detective: characterSheets.detective,
  mechanic: characterSheets.mechanic,
  mechanicFifth: characterSheets.mechanicFifth,
  engineer,
  crashSite,
}

export type ArtId = keyof typeof sources

const images = Object.fromEntries(
  Object.entries(sources).map(([id, src]) => {
    const image = new Image()
    image.src = src
    return [id, image]
  }),
) as Record<ArtId, HTMLImageElement>

export function art(id: ArtId): HTMLImageElement {
  return images[id]
}

/** Ждёт загрузки всех картинок; битая картинка старт не блокирует */
export function loadCutsceneArt(): Promise<void> {
  return Promise.all(Object.values(images).map((image) => image.decode().catch(() => undefined))).then(() => undefined)
}
