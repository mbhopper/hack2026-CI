/**
 * Состояние расследования. Пока бэкенда нет, храним в localStorage по id
 * игрока; потом это станет полем профиля на сервере (задача кейса про
 * сохранение прогресса).
 */

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface Accusation {
  suspect: string
  method: string
  motive: string
}

export interface GameState {
  introSeen: boolean
  difficulty: Difficulty
  /** Найденные улики (id из story.ts) */
  found: string[]
  /** Показания, записанные в блокнот на допросах */
  facts: string[]
  /** Заданные вопросы, `подозреваемый:вопрос` */
  asked: string[]
  /** Последнее обвинение и сколько раз игрок обвинял */
  accusation: Accusation | null
  attempts: number
}

/** Фото с финиша детектив получает вместе с делом */
export const STARTING_CLUES = ['finish-photo']

export const initialState: GameState = {
  introSeen: false,
  difficulty: 'normal',
  found: STARTING_CLUES,
  facts: [],
  asked: [],
  accusation: null,
  attempts: 0,
}

const key = (userId: string) => `last-lap:game:${userId}`
/** Ключ первой версии прогресса — переносим из него то, что было */
const legacyKey = (userId: string) => `last-lap:progress:${userId}`

export function loadState(userId: string): GameState {
  try {
    const raw = localStorage.getItem(key(userId))
    if (raw) return { ...initialState, ...(JSON.parse(raw) as Partial<GameState>) }
    const legacy = localStorage.getItem(legacyKey(userId))
    if (legacy) {
      const old = JSON.parse(legacy) as { introSeen?: boolean; examined?: string[] }
      return {
        ...initialState,
        introSeen: Boolean(old.introSeen),
        found: [...new Set([...STARTING_CLUES, ...(old.examined ?? [])])],
      }
    }
  } catch {
    // битые данные — начинаем заново
  }
  return initialState
}

export function saveState(userId: string, state: GameState) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(state))
  } catch {
    // приватный режим или переполнение — игра просто не запомнит прогресс
  }
}

/** Есть ли у игрока сохранённое дело */
export function hasState(userId: string) {
  try {
    return localStorage.getItem(key(userId)) !== null || localStorage.getItem(legacyKey(userId)) !== null
  } catch {
    return false
  }
}

/** Стереть прогресс: гость ушёл, и вернуться к нему уже нельзя */
export function forgetState(userId: string) {
  try {
    localStorage.removeItem(key(userId))
  } catch {
    // нечего стирать
  }
}

const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id])

export type GameAction =
  | { type: 'load'; state: GameState }
  | { type: 'introSeen' }
  | { type: 'find'; id: string }
  | { type: 'ask'; id: string; facts: string[] }
  | { type: 'accuse'; accusation: Accusation }
  | { type: 'difficulty'; difficulty: Difficulty }
  | { type: 'reset' }

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'load':
      return action.state
    case 'introSeen':
      return { ...state, introSeen: true }
    case 'find':
      return { ...state, found: add(state.found, action.id) }
    case 'ask':
      return {
        ...state,
        asked: add(state.asked, action.id),
        facts: action.facts.reduce(add, state.facts),
      }
    case 'accuse':
      return { ...state, accusation: action.accusation, attempts: state.attempts + 1 }
    case 'difficulty':
      // та же защита, что и в интерфейсе: после обвинения уровень зафиксирован
      return state.attempts > 0 ? state : { ...state, difficulty: action.difficulty }
    case 'reset':
      // новое расследование: катсцену и сложность помним
      return { ...initialState, introSeen: state.introSeen, difficulty: state.difficulty }
  }
}
