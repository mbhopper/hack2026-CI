import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { characterSheets, drawCharacter, IDLE_FRAME, walkFrame, type Direction } from '../game/characters.ts'
import { crashSite, distanceToRect, isWalkable } from '../game/locations/crashSite.ts'
import { loadProgress, saveProgress } from '../game/progress.ts'
import { H, W } from '../game/scenery.ts'
import { clues } from '../game/story.ts'
import { useImage } from '../game/useImage.ts'
import { routes } from '../routes.ts'
import './TrackPage.css'

const pct = (value: number, total: number) => `${(value / total) * 100}%`

/** Скорость детектива, пикселей сцены в секунду */
const SPEED = 56
/** С какого расстояния до улики её можно осмотреть клавишей */
const REACH = 22
/** Кадров ходьбы в секунду */
const STEPS_PER_SECOND = 8

const MOVE_KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
}

interface Drop {
  x: number
  y: number
  speed: number
}

function makeRain(count: number): Drop[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * (W + 40),
    y: Math.random() * H,
    speed: 140 + Math.random() * 80,
  }))
}

function nearestClue(x: number, y: number): string | null {
  let best: string | null = null
  let bestDistance = REACH
  for (const clue of clues) {
    const distance = distanceToRect(clue, x, y)
    if (distance <= bestDistance) {
      best = clue.id
      bestDistance = distance
    }
  }
  return best
}

export function TrackPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [examined, setExamined] = useState<string[]>(() => (user ? loadProgress(user.id).examined : []))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [nearId, setNearId] = useState<string | null>(null)

  const background = useImage(crashSite.background)
  const detective = useImage(characterSheets.detective)

  const player = useRef({ ...crashSite.start, moving: false, step: 0 })
  const pressed = useRef<string[]>([])
  const nearRef = useRef<string | null>(null)

  const examine = useCallback(
    (id: string) => {
      setActiveId(id)
      setExamined((current) => {
        if (current.includes(id)) return current
        const next = [...current, id]
        if (user) saveProgress(user.id, { examined: next })
        return next
      })
    },
    [user],
  )

  // Клавиатура: стрелки/WASD — идти, E — осмотреть то, что рядом
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code in MOVE_KEYS) {
        event.preventDefault()
        if (!pressed.current.includes(event.code)) pressed.current.push(event.code)
      } else if (event.code === 'KeyE' && nearRef.current) {
        examine(nearRef.current)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      pressed.current = pressed.current.filter((code) => code !== event.code)
    }
    const onBlur = () => {
      pressed.current = []
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [examine])

  // Игровой цикл: движение, дождь, отрисовка
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !background || !detective) return
    ctx.imageSmoothingEnabled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rain = makeRain(reducedMotion ? 0 : 90)
    let last = performance.now()
    let raf = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = player.current

      // последняя нажатая клавиша задаёт направление взгляда
      let dx = 0
      let dy = 0
      for (const code of pressed.current) {
        dx += MOVE_KEYS[code][0]
        dy += MOVE_KEYS[code][1]
      }
      dx = Math.sign(dx)
      dy = Math.sign(dy)
      p.moving = dx !== 0 || dy !== 0
      if (p.moving) {
        const lastCode = pressed.current[pressed.current.length - 1]
        const [lx, ly] = MOVE_KEYS[lastCode] ?? [dx, dy]
        const dir: Direction = lx < 0 ? 'left' : lx > 0 ? 'right' : ly < 0 ? 'up' : 'down'
        p.dir = dir
        const length = Math.hypot(dx, dy)
        const nx = p.x + (dx / length) * SPEED * dt
        const ny = p.y + (dy / length) * SPEED * dt
        // по осям отдельно — чтобы скользить вдоль ленты, а не застревать
        if (isWalkable(crashSite, nx, p.y)) p.x = nx
        if (isWalkable(crashSite, p.x, ny)) p.y = ny
        p.step += dt * STEPS_PER_SECOND
      }

      const near = nearestClue(p.x, p.y)
      if (near !== nearRef.current) {
        nearRef.current = near
        setNearId(near)
      }

      ctx.drawImage(background, 0, 0)
      drawCharacter(ctx, detective, p.dir, p.moving ? walkFrame(p.step) : IDLE_FRAME, p.x, p.y)

      if (near) {
        // «!» над головой: рядом есть что осмотреть
        const bx = Math.round(p.x) - 3
        const by = Math.round(p.y) - 42
        ctx.fillStyle = '#0b0f0e'
        ctx.fillRect(bx - 1, by - 1, 8, 12)
        ctx.fillStyle = '#e8c43a'
        ctx.fillRect(bx, by, 6, 10)
        ctx.fillStyle = '#0b0f0e'
        ctx.fillRect(bx + 2, by + 2, 2, 4)
        ctx.fillRect(bx + 2, by + 7, 2, 2)
      }

      ctx.fillStyle = 'rgba(120, 150, 165, 0.45)'
      for (const drop of rain) {
        drop.y += drop.speed * dt
        drop.x -= drop.speed * dt * 0.25
        if (drop.y > H) {
          drop.y -= H + 6
          drop.x = Math.random() * (W + 40)
        }
        ctx.fillRect(Math.round(drop.x), Math.round(drop.y), 1, 3)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [background, detective])

  const active = useMemo(() => clues.find((clue) => clue.id === activeId) ?? null, [activeId])
  const near = useMemo(() => clues.find((clue) => clue.id === nearId) ?? null, [nearId])
  const allFound = clues.every((clue) => examined.includes(clue.id))

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Спустя два дня" />}>
      <div className="site">
        <div className="site__intro">
          <h1 className="site__title">Место аварии</h1>
          <p className="site__lead">
            Обломки болида №7 так и не убрали. Пройдите к машине через проход в ленте и осмотрите всё вокруг.
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
                {seen && (
                  <span className="site__marker" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
          {near && (
            <p className="site__prompt" aria-live="polite">
              <kbd>E</kbd> осмотреть: {near.title}
            </p>
          )}
        </div>
        <p className="site__controls">Стрелки или WASD — идти · E — осмотреть · можно нажимать на метки</p>

        <div className="site__panels">
          <section className="site__note" aria-live="polite">
            {active ? (
              <>
                <h2>{active.title}</h2>
                <p>{active.note}</p>
              </>
            ) : (
              <p className="site__placeholder">Подойдите к метке и нажмите E или кликните по ней.</p>
            )}
          </section>

          <section className="site__notebook">
            <h2>
              Блокнот <span>{clues.filter((clue) => examined.includes(clue.id)).length}/{clues.length}</span>
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
            {!allFound && <p className="site__hint">Сначала осмотрите все улики</p>}
          </section>
        </div>
      </div>
    </PageShell>
  )
}
