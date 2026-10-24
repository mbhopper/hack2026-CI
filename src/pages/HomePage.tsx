import { ButtonLink } from '../components/Button.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { routes } from '../routes.ts'
import './HomePage.css'

export function HomePage() {
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
        <p className="home__lead">Зарегистрируйся или войди, чтобы начать игру</p>
        <div className="home__actions">
          <ButtonLink to={routes.login}>Войти</ButtonLink>
          <ButtonLink to={routes.register} variant="ghost">
            Регистрация
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  )
}
