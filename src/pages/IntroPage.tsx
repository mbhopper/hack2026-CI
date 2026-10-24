import { useNavigate } from 'react-router-dom'
import { Cutscene } from '../cutscene/Cutscene.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { saveProgress } from '../game/progress.ts'
import { routes } from '../routes.ts'

/** Вступительная катсцена: сюда попадаем сразу после входа */
export function IntroPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Cutscene
      playerName={user?.nickname ?? 'детектив'}
      onFinish={() => {
        if (user) saveProgress(user.id, { introSeen: true })
        navigate(routes.track)
      }}
    />
  )
}
