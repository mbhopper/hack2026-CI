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
import { validateNickname, validatePassword, validatePasswordConfirm } from '../lib/validation.ts'
import './AuthForm.css'

interface Errors {
  nickname?: string
  password?: string
  confirm?: string
}

export function RegisterPage() {
  const location = useLocation()
  const { user, register } = useAuth()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Errors = {
      nickname: validateNickname(nickname),
      password: validatePassword(password),
      confirm: validatePasswordConfirm(password, confirm),
    }
    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.nickname || nextErrors.password || nextErrors.confirm) return

    setPending(true)
    try {
      await register({ nickname: nickname.trim(), password })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось создать аккаунт')
    } finally {
      setPending(false)
    }
  }

  // уже вошли (или только что вошли) — ведём туда, куда шёл игрок, или продолжаем игру
  if (user) return <Navigate to={(location.state as FromState | null)?.from ?? routes.play} replace />

  return (
    <PageShell fadedTrack headerSlot={<BackLink />}>
      <AuthCard
        fileLabel="Личное дело"
        stamp="Новый сотрудник"
        stampTone="warning"
        title="Регистрация"
        subtitle="Заведите удостоверение детектива — без почты и телефона, только никнейм."
        footer={
          <>
            Уже есть аккаунт? <Link to={routes.login} state={location.state}>Войти</Link>
          </>
        }
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="auth-form__error" role="alert">
              {formError}
            </p>
          )}
          <Field
            label="Никнейм"
            name="nickname"
            placeholder="detective_01"
            autoComplete="username"
            hint="3–16 символов: латиница, цифры, «_»"
            value={nickname}
            error={errors.nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Field
            label="Повторите пароль"
            name="confirm"
            type="password"
            placeholder="........"
            autoComplete="new-password"
            value={confirm}
            error={errors.confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
          <Button className="auth-form__submit" type="submit" block disabled={pending}>
            {pending ? 'Оформляем…' : 'Создать аккаунт'}
          </Button>
        </form>
      </AuthCard>
    </PageShell>
  )
}
