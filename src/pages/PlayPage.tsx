import { Navigate } from 'react-router-dom'
import { resumeRoute } from '../game/progress.ts'
import { useGame } from '../game/useGame.ts'

/** «Продолжить»: ведём туда, где игрок остановился */
export function PlayPage() {
  const { state } = useGame()
  return <Navigate to={resumeRoute(state)} replace />
}
