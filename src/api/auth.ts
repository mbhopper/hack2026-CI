import { API_URL } from './http.ts'
import { httpAuthApi } from './auth.http.ts'
import { mockAuthApi } from './auth.mock.ts'
import type { AuthApi } from './types.ts'

/** Пока VITE_API_URL не задан, работаем на моке. */
export const authApi: AuthApi = API_URL ? httpAuthApi : mockAuthApi

export * from './types.ts'
export { ApiError } from './http.ts'
