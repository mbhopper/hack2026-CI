import { Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { PORTRAIT_SIZE, suspectPortraits } from '../game/portraits.ts'
import { suspects } from '../game/story.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'

/** Заглушка допроса: диалоги — следующий этап */
export function InterrogationPage() {
  const { id } = useParams()
  const suspect = suspects.find((item) => item.id === id)
  if (!suspect) return <Navigate to={routes.suspects} replace />

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Допрос" />}>
      <div className="suspects">
        <div className="suspects__portrait">
          <img
            className="suspects__sprite"
            src={suspectPortraits[suspect.id].nervous}
            alt={suspect.name}
            width={PORTRAIT_SIZE * 3}
            height={PORTRAIT_SIZE * 3}
          />
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
