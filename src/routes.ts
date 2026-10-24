export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  /** Игра без регистрации */
  guest: '/guest',
  /** Продолжить игру с того места, где остановились */
  play: '/play',
  /** Катсцена, с которой начинается игра после входа */
  intro: '/intro',
  /** Осмотр места: трасса, бокс №7 или VIP-ложа */
  inspect: (location: string) => `/inspect/${location}`,
  /** Карусель подозреваемых */
  suspects: '/suspects',
  /** Допрос выбранного подозреваемого */
  interrogation: (id: string) => `/suspects/${id}`,
  /** Обвинение: кто, как и зачем */
  accuse: '/accuse',
  /** Чем закончилось дело */
  ending: '/ending',
  /** Экран о профессии детектива после раскрытого дела */
  career: '/career',
} as const
