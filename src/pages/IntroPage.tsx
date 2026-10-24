import { useNavigate } from 'react-router-dom'
import { Cutscene } from '../cutscene/Cutscene.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'

/** Вступительная катсцена: с неё начинается новое расследование */
export function IntroPage() {
  const { user } = useAuth()
  const { state, dispatch } = useGame()
  const navigate = useNavigate()

  return (
    <Cutscene
      playerName={user?.nickname ?? 'детектив'}
      seen={state.introSeen}
      onFinish={() => {
        dispatch({ type: 'introSeen' })
        navigate(routes.track)
      }}
    />
  )
}
