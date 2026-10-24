import { request } from './http.ts'
import type { AuthApi, AuthResponse, User } from './types.ts'

export const httpAuthApi: AuthApi = {
  login: (credentials) => request<AuthResponse>('/auth/login', { method: 'POST', body: credentials }),
  register: (credentials) => request<AuthResponse>('/auth/register', { method: 'POST', body: credentials }),
  me: (token) => request<User>('/auth/me', { token }),
  logout: (token) => request<void>('/auth/logout', { method: 'POST', token }),
}
