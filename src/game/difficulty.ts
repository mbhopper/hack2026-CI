import type { Difficulty } from './state.ts'

export const difficulties: { id: Difficulty; title: string; text: string }[] = [
  { id: 'easy', title: 'Легко', text: 'Метки заметнее, закрытые вопросы подсказывают, какая улика нужна.' },
  { id: 'normal', title: 'Нормально', text: 'Метки видны, суд говорит, в какой части версии ошибка.' },
  { id: 'hard', title: 'Сложно', text: 'Меток не видно, подсказок нет, на обвинение всего три попытки.' },
]

/** На сложном уровне после стольких ошибок дело забирают */
export const HARD_ATTEMPTS = 3
