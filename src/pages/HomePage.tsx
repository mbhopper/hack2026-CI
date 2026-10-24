import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../components/Button.tsx'
import { DifficultyPicker } from '../components/DifficultyPicker.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { routes } from '../routes.ts'
import './HomePage.css'

export function HomePage() {
  const { user, loading, logout } = useAuth()

  return (
    <PageShell
      withCar
      headerSlot={<span>Круг 3/3</span>}
      footerSlot={
        <>
          <span>Команда [НАЗВАНИЕ КОМАНДЫ]</span>
          <span>Кейс банка «Центр-инвест» · Разработка игры</span>
        </>
      }
    >
      <div className="home">
        <p className="home__tagline">Основано на реальных событиях</p>
        <h1 className="home__title">
          <span>Последний</span>
          <span>круг</span>
        </h1>
        {!loading &&
          (user ? (
            <>
              <p className="home__lead">С возвращением, детектив {user.nickname}</p>
              <div className="home__actions">
                <ButtonLink to={routes.play}>Продолжить</ButtonLink>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (user.guest && !window.confirm('У гостя нет аккаунта: прогресс удалится. Завершить игру?')) return
                    void logout()
                  }}
                >
                  {user.guest ? 'Завершить игру' : 'Выйти'}
                </Button>
              </div>
              <div className="home__settings">
                <DifficultyPicker />
              </div>
            </>
          ) : (
            <>
              <p className="home__lead">Зарегистрируйся или войди, чтобы начать игру</p>
              <div className="home__actions">
                <ButtonLink to={routes.login}>Войти</ButtonLink>
                <ButtonLink to={routes.register} variant="ghost">
                  Регистрация
                </ButtonLink>
              </div>
              <p className="home__guest">
                <Link to={routes.guest}>Играть без регистрации</Link>
              </p>
            </>
          ))}
      </div>
    </PageShell>
  )
}
