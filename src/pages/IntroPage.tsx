import { Button } from '../components/Button.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import './IntroPage.css'

/**
 * Заглушка под катсцену: сюда мы попадаем сразу после входа.
 */
export function IntroPage() {
  const { user, logout } = useAuth()

  return (
    <PageShell headerSlot={<span>Круг 1/3</span>}>
      <div className="intro">
        <p className="intro__disclaimer">Основано на реальных событиях</p>
        <h1 className="intro__title">Катсцена</h1>
        <p className="intro__lead">
          Детектив {user?.nickname}, добро пожаловать на трассу. Здесь появится вступительный ролик.
        </p>
        <Button variant="ghost" onClick={() => void logout()}>
          Выйти
        </Button>
      </div>
    </PageShell>
  )
}
