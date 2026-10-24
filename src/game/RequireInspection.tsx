import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { inspectionDone, resumeRoute } from './progress.ts'
import { useGame } from './useGame.ts'

/** Подозреваемых открываем только после осмотра; иначе возвращаем туда, где игрок остановился */
export function RequireInspection({ children }: { children: ReactNode }) {
  const { state } = useGame()
  if (!inspectionDone(state)) return <Navigate to={resumeRoute(state)} replace />
  return <>{children}</>
}
