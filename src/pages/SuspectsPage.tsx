import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { PixelSprite } from '../components/PixelSprite.tsx'
import { personSprite } from '../game/sprites.ts'
import { suspects } from '../game/story.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'

export function SuspectsPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const suspect = suspects[index]
  const step = (delta: number) => setIndex((current) => (current + delta + suspects.length) % suspects.length)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      const delta = event.key === 'ArrowLeft' ? -1 : 1
      setIndex((current) => (current + delta + suspects.length) % suspects.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Подозреваемые" />}>
      <div className="suspects">
        <h1 className="suspects__title">Выбор подозреваемого</h1>

        <div className="suspects__carousel">
          <button type="button" className="suspects__arrow" onClick={() => step(-1)} aria-label="Предыдущий подозреваемый">
            ◀
          </button>

          <figure className="suspects__card" aria-live="polite">
            <div className="suspects__portrait">
              <PixelSprite
                key={suspect.id}
                className="suspects__sprite"
                sprite={personSprite(suspect.sprite, suspect.outfit)}
                scale={8}
                label={suspect.name}
              />
            </div>
            <figcaption>
              <p className="suspects__role">{suspect.role}</p>
              <h2 className="suspects__name">{suspect.name}</h2>
              <p className="suspects__summary">{suspect.summary}</p>
            </figcaption>
          </figure>

          <button type="button" className="suspects__arrow" onClick={() => step(1)} aria-label="Следующий подозреваемый">
            ▶
          </button>
        </div>

        <div className="suspects__dots" aria-hidden="true">
          {suspects.map((item, i) => (
            <span key={item.id} data-active={i === index} />
          ))}
        </div>

        <Button onClick={() => navigate(routes.interrogation(suspect.id))}>Выбрать подозреваемого</Button>
        <p className="suspects__hint">← → — листать</p>
      </div>
    </PageShell>
  )
}
