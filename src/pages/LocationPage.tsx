import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { PixelSprite } from '../components/PixelSprite.tsx'
import { closeUp, sceneDrawers } from '../game/locations.ts'
import { locationDone, locationOpen, resumeRoute } from '../game/progress.ts'
import { H, W } from '../game/scenery.ts'
import { clueById, cluesAt, locations, type Location } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './LocationPage.css'

const pct = (value: number, total: number) => `${(value / total) * 100}%`

/** /inspect/:id — проверяем, что место существует и уже открыто */
export function LocationRoute() {
  const { id } = useParams()
  const { state } = useGame()
  const place = locations.find((location) => location.id === id)
  if (!place || !locationOpen(state, place.id)) return <Navigate to={resumeRoute(state)} replace />
  // key: при переходе в другое место выбранная улика сбрасывается
  return <LocationPage key={place.id} place={place} />
}

function LocationPage({ place }: { place: Location }) {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const clues = cluesAt(place.id)
  const examined = state.found

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const draw = sceneDrawers[place.id]
    ctx.imageSmoothingEnabled = false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(ctx, 0, false)
      return
    }
    let raf = 0
    const loop = (now: number) => {
      draw(ctx, now / 1000, true)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [place.id])

  const active = activeId ? clueById(activeId) : undefined
  const zoom = useMemo(() => (active?.spot ? closeUp(place.id, active.spot) : null), [active, place.id])
  const foundCount = clues.filter((clue) => examined.includes(clue.id)).length
  const allFound = foundCount === clues.length
  const next = locations[locations.findIndex((location) => location.id === place.id) + 1]

  const examine = (id: string) => {
    setActiveId(id)
    dispatch({ type: 'find', id })
  }

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Спустя два дня" />}>
      <div className="site">
        <nav className="site__places" aria-label="Места для осмотра">
          {locations.map((location) => {
            const done = locationDone(state, location.id)
            if (!locationOpen(state, location.id)) {
              return (
                <span key={location.id} className="site__place site__place--locked" title="Сначала закончите осмотр">
                  {location.title}
                </span>
              )
            }
            return (
              <Link
                key={location.id}
                to={routes.inspect(location.id)}
                className={`site__place${done ? ' site__place--done' : ''}`}
                aria-current={location.id === place.id ? 'page' : undefined}
              >
                {location.title}
              </Link>
            )
          })}
        </nav>

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
              <div className="site__clue">
                {zoom && (
                  <PixelSprite
                    className="site__closeup"
                    sprite={zoom}
                    scale={Math.max(2, Math.floor(240 / zoom.width))}
                    label={`Крупный план: ${active.title}`}
                  />
                )}
                <div>
                  <h2>{active.title}</h2>
                  <p>{active.note}</p>
                </div>
              </div>
            ) : (
              <p className="site__placeholder">Выберите метку, чтобы рассмотреть её поближе.</p>
            )}
          </section>

          <section className="site__notebook">
            <h2>
              Найдено здесь <span>{foundCount}/{clues.length}</span>
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
            <Button
              block
              disabled={!allFound}
              onClick={() => navigate(next ? routes.inspect(next.id) : routes.suspects)}
            >
              {next ? `Дальше: ${next.title}` : 'К подозреваемым'}
            </Button>
            {!allFound && <p className="site__hint">Сначала осмотрите все метки</p>}
          </section>
        </div>
      </div>
    </PageShell>
  )
}
