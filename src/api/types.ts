/**
 * Контракт с будущим бэкендом. Когда появится сервер, он должен
 * принимать и отдавать именно эти формы.
 */

export interface User {
  id: string
  nickname: string
  createdAt: string
  /** Гость без регистрации: живёт только в этом браузере, сервер о нём не знает */
  guest?: boolean
}

export interface Credentials {
  nickname: string
  password: string
}

/** Ответ на POST /auth/login и POST /auth/register */
export interface AuthResponse {
  token: string
  user: User
}

export interface AuthApi {
  login(credentials: Credentials): Promise<AuthResponse>
  register(credentials: Credentials): Promise<AuthResponse>
  /** GET /auth/me — проверка сохранённого токена */
  me(token: string): Promise<User>
  logout(token: string): Promise<void>
}
