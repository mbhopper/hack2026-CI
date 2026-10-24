/**
 * Прогресс игрока. Пока бэкенда нет, храним в localStorage по id игрока;
 * потом это станет полем профиля на сервере (задача кейса про сохранения).
 */

export interface Progress {
  introSeen: boolean
  /** id осмотренных улик на трассе */
  examined: string[]
}

const empty: Progress = { introSeen: false, examined: [] }
const key = (userId: string) => `last-lap:progress:${userId}`

export function loadProgress(userId: string): Progress {
  try {
    const raw = localStorage.getItem(key(userId))
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<Progress>) } : empty
  } catch {
    return empty
  }
}

export function saveProgress(userId: string, patch: Partial<Progress>): Progress {
  const next = { ...loadProgress(userId), ...patch }
  try {
    localStorage.setItem(key(userId), JSON.stringify(next))
  } catch {
    // приватный режим или переполнение — игра просто не запомнит прогресс
  }
  return next
}
