export const NICKNAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/
export const PASSWORD_MIN_LENGTH = 8

export function validateNickname(value: string): string | undefined {
  const nickname = value.trim()
  if (!nickname) return 'Введите никнейм'
  if (!NICKNAME_PATTERN.test(nickname)) return '3–16 символов: латиница, цифры, «_»'
  return undefined
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Введите пароль'
  if (!value.trim()) return 'Пароль не может состоять из одних пробелов'
  if (value.length < PASSWORD_MIN_LENGTH) return `Минимум ${PASSWORD_MIN_LENGTH} символов`
  return undefined
}

export function validatePasswordConfirm(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Повторите пароль'
  if (password !== confirm) return 'Пароли не совпадают'
  return undefined
}
