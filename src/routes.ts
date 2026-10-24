export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  /** Продолжить игру с того места, где остановились */
  play: '/play',
  /** Катсцена, с которой начинается игра после входа */
  intro: '/intro',
  /** Осмотр места аварии через два дня */
  track: '/track',
  /** Карусель подозреваемых */
  suspects: '/suspects',
  /** Допрос выбранного подозреваемого */
  interrogation: (id: string) => `/suspects/${id}`,
} as const
