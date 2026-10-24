import { createContext } from 'react'
import type { Credentials, User } from '../api/auth.ts'

export interface AuthContextValue {
  user: User | null
  /** true, пока проверяем сохранённый токен при загрузке */
  loading: boolean
  login(credentials: Credentials): Promise<void>
  register(credentials: Credentials): Promise<void>
  /** Играть без регистрации под любым именем */
  playAsGuest(nickname: string): void
  logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
