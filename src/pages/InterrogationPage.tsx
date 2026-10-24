import { Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/Button.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { PixelSprite } from '../components/PixelSprite.tsx'
import { personSprite } from '../game/sprites.ts'
import { suspects } from '../game/story.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'

/** Заглушка допроса: диалоги — следующий этап */
export function InterrogationPage() {
  const { id } = useParams()
  const suspect = suspects.find((item) => item.id === id)
  if (!suspect) return <Navigate to={routes.suspects} replace />

  return (
    <PageShell fadedTrack headerSlot={<span>Допрос</span>}>
      <div className="suspects">
        <div className="suspects__portrait">
          <PixelSprite sprite={personSprite(suspect.sprite, suspect.outfit)} scale={8} label={suspect.name} />
        </div>
        <h1 className="suspects__title">{suspect.name}</h1>
        <p className="suspects__summary">Здесь будет диалог с подозреваемым.</p>
        <ButtonLink to={routes.suspects} variant="ghost">
          ← К подозреваемым
        </ButtonLink>
      </div>
    </PageShell>
  )
}
