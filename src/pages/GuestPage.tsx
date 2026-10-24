import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard.tsx'
import { BackLink } from '../components/BackLink.tsx'
import { Button } from '../components/Button.tsx'
import { Field } from '../components/Field.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import type { FromState } from '../auth/RequireAuth.tsx'
import { routes } from '../routes.ts'
import './AuthForm.css'

const GUEST_NAME_MAX = 20

/** Игра без регистрации: только имя, которым детектива назовут в катсцене */
export function GuestPage() {
  const location = useLocation()
  const { user, playAsGuest } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nickname = name.trim() || 'Гость'
    if (nickname.length > GUEST_NAME_MAX) {
      setError(`Не длиннее ${GUEST_NAME_MAX} символов`)
      return
    }
    playAsGuest(nickname)
  }

  if (user) return <Navigate to={(location.state as FromState | null)?.from ?? routes.play} replace />

  return (
    <PageShell fadedTrack headerSlot={<BackLink />}>
      <AuthCard
        fileLabel="Временный пропуск"
        stamp="Гость"
        stampTone="warning"
        title="Без регистрации"
        subtitle="Как к вам обращаться? Прогресс сохранится только в этом браузере и пропадёт после выхода."
        footer={
          <>
            Хотите играть с разных устройств? <Link to={routes.register} state={location.state}>Зарегистрируйтесь</Link>
          </>
        }
      >
        <form className="auth-form" onSubmit={submit} noValidate>
          <Field
            label="Имя детектива"
            name="nickname"
            placeholder="Гость"
            autoComplete="nickname"
            hint="Можно по-русски. Пусто — будете «Гость»"
            maxLength={GUEST_NAME_MAX + 5}
            value={name}
            error={error}
            onChange={(event) => setName(event.target.value)}
          />
          <Button className="auth-form__submit" type="submit" block>
            Начать расследование
          </Button>
        </form>
      </AuthCard>
    </PageShell>
  )
}
