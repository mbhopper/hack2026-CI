import type { Accusation } from './state.ts'

/** Варианты для обвинения: кто, как и зачем */

export interface Option {
  id: string
  text: string
}

export const methods: Option[] = [
  { id: 'brakes', text: 'Повредил тормоза на пит-стопе' },
  { id: 'cruise', text: 'Во время пит-стопа зафиксировал круиз-контроль на максимуме' },
  { id: 'ram', text: 'Вытеснил болид №7 в отбойник на трассе' },
  { id: 'cooling', text: 'Отключил охлаждение мотора' },
]

export const motives: Option[] = [
  { id: 'rivalry', text: 'Вечное соперничество: хотел наконец выиграть' },
  { id: 'insurance', text: 'Страховка на 50 миллионов: пилот уходил из команды, и вложения сгорали' },
  { id: 'revenge', text: 'Месть за выговор после прошлой гонки' },
  { id: 'bet', text: 'Крупная ставка на победу болида №22' },
]

export const solution: Accusation = { suspect: 'sponsor', method: 'cruise', motive: 'insurance' }

export type Verdict = 'solved' | 'wrong-suspect' | 'weak-case'

export function verdict(accusation: Accusation): Verdict {
  if (accusation.suspect !== solution.suspect) return 'wrong-suspect'
  if (accusation.method !== solution.method || accusation.motive !== solution.motive) return 'weak-case'
  return 'solved'
}
