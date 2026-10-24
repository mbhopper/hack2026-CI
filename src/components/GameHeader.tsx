import { useAuth } from '../auth/useAuth.ts'
import './GameHeader.css'

/** Правый угол шапки в игре: где мы сейчас и кнопка выхода */
export function GameHeader({ label }: { label: string }) {
  const { logout } = useAuth()
  return (
    <span className="game-header">
      <span>{label}</span>
      <button type="button" className="game-header__logout" onClick={() => void logout()}>
        Выйти
      </button>
    </span>
  )
}
