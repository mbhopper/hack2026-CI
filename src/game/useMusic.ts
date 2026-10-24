import { useEffect } from 'react'
import { music, type TrackId } from './music.ts'

/**
 * Трек страницы. Без аргумента страница своего трека не имеет:
 * доигрывает то, что уже звучит, а в тишине включает тревогу.
 */
export function useMusic(track?: TrackId) {
  useEffect(() => {
    if (track) music.play(track)
    else music.keep('tension')
  }, [track])
}
