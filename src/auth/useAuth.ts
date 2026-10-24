import { use } from 'react'
import { AuthContext } from './AuthContext.ts'

export function useAuth() {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth вызван вне AuthProvider')
  return context
}
