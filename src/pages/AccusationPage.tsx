import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Cutscene } from '../cutscene/Cutscene.tsx'
import { CULPRIT, accusationScript } from '../cutscene/accusation.ts'
import { useAuth } from '../auth/useAuth.ts'
import { allQuestioned } from '../game/dialogues.ts'
import { loadProgress } from '../game/progress.ts'
import { routes } from '../routes.ts'

/** Финал: катсцена обвинения. Ошибка возвращает к подозреваемым, верный ответ — на главную */
export function AccusationPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const scenes = useMemo(() => accusationScript(id), [id])
  const ready = user ? allQuestioned(loadProgress(user.id).asked) : false

  if (!scenes || !ready) return <Navigate to={routes.suspects} replace />

  return (
    <Cutscene
      key={id}
      scenes={scenes}
      title="Обвинение"
      playerName={user?.nickname ?? 'детектив'}
      onFinish={() => (id === CULPRIT ? navigate(routes.home) : navigate(routes.suspects, { state: { afterWrong: true } }))}
    />
  )
}
