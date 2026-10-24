import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, type Credentials, type User } from '../api/auth.ts'
import { forgetState } from '../game/state.ts'
import { AuthContext, type AuthContextValue } from './AuthContext.ts'

const TOKEN_KEY = 'last-lap:token'
const GUEST_KEY = 'last-lap:guest'

function readGuest(): User | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writeGuest(guest: User | null) {
  try {
    if (guest) localStorage.setItem(GUEST_KEY, JSON.stringify(guest))
    else localStorage.removeItem(GUEST_KEY)
  } catch {
    // гость просто не переживёт перезагрузку
  }
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // не страшно: сессия просто не переживёт перезагрузку
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => (readToken() ? null : readGuest()))
  const [loading, setLoading] = useState(() => readToken() !== null)

  useEffect(() => {
    const token = readToken()
    if (!token) return
    let cancelled = false
    authApi
      .me(token)
      .then((restored) => {
        if (!cancelled) setUser(restored)
      })
      .catch(() => {
        writeToken(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // вход в аккаунт заменяет гостя
  const login = useCallback(async (credentials: Credentials) => {
    const { token, user: authorized } = await authApi.login(credentials)
    writeGuest(null)
    writeToken(token)
    setUser(authorized)
  }, [])

  const register = useCallback(async (credentials: Credentials) => {
    const { token, user: created } = await authApi.register(credentials)
    writeGuest(null)
    writeToken(token)
    setUser(created)
  }, [])

  const playAsGuest = useCallback((nickname: string) => {
    const guest: User = {
      id: `guest-${crypto.randomUUID()}`,
      nickname,
      createdAt: new Date().toISOString(),
      guest: true,
    }
    writeGuest(guest)
    setUser(guest)
  }, [])

  const logout = useCallback(async () => {
    const guest = readGuest()
    if (guest) {
      // у гостя нет аккаунта, к его прогрессу больше не вернуться
      forgetState(guest.id)
      writeGuest(null)
    }
    const token = readToken()
    writeToken(null)
    setUser(null)
    if (token) await authApi.logout(token).catch(() => undefined)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, playAsGuest, logout }),
    [user, loading, login, register, playAsGuest, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
