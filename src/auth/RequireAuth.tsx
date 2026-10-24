import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { routes } from '../routes.ts'
import { useAuth } from './useAuth.ts'

/** Куда игрок шёл до входа: LoginPage вернёт его туда */
export interface FromState {
  from?: string
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) return <Navigate to={routes.login} replace state={{ from: location.pathname } satisfies FromState} />
  return <>{children}</>
}
