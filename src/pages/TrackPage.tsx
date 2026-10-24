import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { drawCrashSite } from '../game/crashSite.ts'
import { loadProgress, saveProgress } from '../game/progress.ts'
import { H, W } from '../game/scenery.ts'
import { clues } from '../game/story.ts'
import { routes } from '../routes.ts'
import './TrackPage.css'

const pct = (value: number, total: number) => `${(value / total) * 100}%`

export function TrackPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [examined, setExamined] = useState<string[]>(() => (user ? loadProgress(user.id).examined : []))
  const [activeId, setActiveId] = useState<string | null>(null)

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

  const active = useMemo(() => clues.find((clue) => clue.id === activeId) ?? null, [activeId])
  const allFound = examined.length >= clues.length

  const examine = (id: string) => {
    setActiveId(id)
    if (examined.includes(id)) return
    const next = [...examined, id]
    setExamined(next)
    if (user) saveProgress(user.id, { examined: next })
  }

  return (
    <PageShell fadedTrack headerSlot={<span>Спустя два дня</span>}>
      <div className="site">
        <div className="site__intro">
          <h1 className="site__title">Место аварии</h1>
          <p className="site__lead">
            Обломки болида №7 так и не убрали. Осмотрите трассу: нажимайте на мигающие метки.
          </p>
        </div>

        <div className="site__stage" style={{ aspectRatio: `${W} / ${H}` }}>
          <canvas ref={canvasRef} width={W} height={H} className="site__canvas" aria-hidden="true" />
          {clues.map((clue) => {
            const seen = examined.includes(clue.id)
            return (
              <button
                key={clue.id}
                type="button"
                className={`site__spot${seen ? ' site__spot--seen' : ''}${clue.id === activeId ? ' site__spot--active' : ''}`}
                style={{ left: pct(clue.x, W), top: pct(clue.y, H), width: pct(clue.w, W), height: pct(clue.h, H) }}
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
              Блокнот <span>{examined.length}/{clues.length}</span>
            </h2>
            <ul>
              {clues.map((clue) => (
                <li key={clue.id} data-found={examined.includes(clue.id)}>
                  {examined.includes(clue.id) ? clue.title : '???'}
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
