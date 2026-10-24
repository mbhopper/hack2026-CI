export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  /** Катсцена, с которой начинается игра после входа */
  intro: '/intro',
  /** Меню локаций после катсцены */
  locations: '/locations',
  /** Локация: место аварии, бокс №7 или VIP-ложа */
  location: (id: string) => `/locations/${id}`,
  /** Карусель подозреваемых */
  suspects: '/suspects',
  /** Допрос выбранного подозреваемого */
  interrogation: (id: string) => `/suspects/${id}`,
  /** Финальная катсцена: обвинение выбранного подозреваемого */
  accusation: (id: string) => `/accuse/${id}`,
} as const
