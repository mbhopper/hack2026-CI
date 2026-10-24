import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { drawCrashSite } from '../game/crashSite.ts'
import { H, W } from '../game/scenery.ts'
import { clueById, cluesAt, locations } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './TrackPage.css'

const pct = (value: number, total: number) => `${(value / total) * 100}%`
const place = locations.find((location) => location.id === 'track')!
const clues = cluesAt('track')

export function TrackPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const examined = state.found

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawCrashSite(ctx, 0, false)
      return
    }
    let raf = 0
    const loop = (now: number) => {
      drawCrashSite(ctx, now / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const active = activeId ? clueById(activeId) : undefined
  const foundCount = clues.filter((clue) => examined.includes(clue.id)).length
  const allFound = foundCount === clues.length

  const examine = (id: string) => {
    setActiveId(id)
    dispatch({ type: 'find', id })
  }

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Спустя два дня" />}>
      <div className="site">
        <div className="site__intro">
          <h1 className="site__title">{place.title}</h1>
          <p className="site__lead">{place.lead}</p>
        </div>

        <div className="site__stage" style={{ aspectRatio: `${W} / ${H}` }}>
          <canvas ref={canvasRef} width={W} height={H} className="site__canvas" aria-hidden="true" />
          {clues.map((clue) => {
            const spot = clue.spot!
            const seen = examined.includes(clue.id)
            return (
              <button
                key={clue.id}
                type="button"
                className={`site__spot${seen ? ' site__spot--seen' : ''}${clue.id === activeId ? ' site__spot--active' : ''}`}
                style={{ left: pct(spot.x, W), top: pct(spot.y, H), width: pct(spot.w, W), height: pct(spot.h, H) }}
                onClick={() => examine(clue.id)}
                aria-label={`${clue.title}${seen ? ', осмотрено' : ''}`}
              >
                <span className="site__marker" aria-hidden="true">
                  {seen ? '✓' : '?'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="site__panels">
          <section className="site__note" aria-live="polite">
            {active ? (
              <>
                <h2>{active.title}</h2>
                <p>{active.note}</p>
              </>
            ) : (
              <p className="site__placeholder">Выберите метку на трассе, чтобы осмотреть место.</p>
            )}
          </section>

          <section className="site__notebook">
            <h2>
              Метки на трассе <span>{foundCount}/{clues.length}</span>
            </h2>
            <ul>
              {clues.map((clue) => (
                <li key={clue.id} data-found={examined.includes(clue.id)}>
                  {examined.includes(clue.id) ? (
                    <button type="button" onClick={() => setActiveId(clue.id)}>
                      {clue.title}
                    </button>
                  ) : (
                    '???'
                  )}
                </li>
              ))}
            </ul>
            <Button block disabled={!allFound} onClick={() => navigate(routes.suspects)}>
              К подозреваемым
            </Button>
            {!allFound && <p className="site__hint">Сначала осмотрите все метки</p>}
          </section>
        </div>
      </div>
    </PageShell>
  )
}
