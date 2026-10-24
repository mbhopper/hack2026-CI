import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.ts'
import { routes } from '../routes.ts'
import { Notebook } from './Notebook.tsx'
import './GameHeader.css'

/** Правый угол шапки в игре: где мы сейчас, блокнот и кнопка выхода */
export function GameHeader({ label }: { label: string }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <span className="game-header">
      <span className="game-header__label">{label}</span>
      <Notebook />
      <button
        type="button"
        className="game-header__logout"
        onClick={() => {
          // переход и выход в одном обновлении: иначе защита страницы
          // успеет увидеть пустую сессию и отправит на вход, а не на главную
          startTransition(() => {
            navigate(routes.home)
            void logout()
          })
        }}
      >
        Выйти
      </button>
    </span>
  )
}
