import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { investigationDone, locationProgress, locations, type Location } from '../game/locations/index.ts'
import { H, W } from '../game/pixels.ts'
import { loadProgress } from '../game/progress.ts'
import { useBackground } from '../game/useBackground.ts'
import { useImage } from '../game/useImage.ts'
import { useMusic } from '../game/useMusic.ts'
import { routes } from '../routes.ts'
import './LocationsPage.css'

function Preview({ location }: { location: Location }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const background = useBackground(location)
  const npcSheet = useImage(location.npc?.sheet ?? '')

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx || !background) return
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(background, 0, 0)
    if (location.npc && npcSheet) location.npc.draw(ctx, npcSheet, 0, false)
  }, [background, location, npcSheet])

  return <canvas ref={ref} width={W} height={H} className="places__preview" aria-hidden="true" />
}

export function LocationsPage() {
  useMusic('tension')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [{ examined, asked }] = useState(() => (user ? loadProgress(user.id) : { examined: [], asked: [] }))
  const allFound = investigationDone(examined, asked)

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Расследование" />}>
      <div className="places">
        <h1 className="places__title">Куда отправиться?</h1>

        <div className="places__row">
          {locations.map((location) => {
            const { found, total } = locationProgress(location, examined, asked)
            return (
              <button
                key={location.id}
                type="button"
                className="places__card"
                onClick={() => navigate(routes.location(location.id))}
              >
                <Preview location={location} />
                <span className="places__name">{location.title}</span>
                <span className="places__count" data-done={found === total}>
                  Улики: {found}/{total}
                </span>
              </button>
            )
          })}
        </div>

        <Button disabled={!allFound} onClick={() => navigate(routes.suspects)}>
          К подозреваемым
        </Button>
        {!allFound && <p className="places__hint">Сначала осмотрите все улики и поговорите со свидетелями</p>}
      </div>
    </PageShell>
  )
}
