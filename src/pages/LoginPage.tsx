import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard.tsx'
import { BackLink } from '../components/BackLink.tsx'
import { Button } from '../components/Button.tsx'
import { Field } from '../components/Field.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { useMusic } from '../game/useMusic.ts'
import { routes } from '../routes.ts'
import { validateNickname, validatePassword } from '../lib/validation.ts'
import './AuthForm.css'

interface Errors {
  nickname?: string
  password?: string
}

export function LoginPage() {
  useMusic('menu')
  const navigate = useNavigate()
  const { login } = useAuth()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Errors = {
      nickname: validateNickname(nickname),
      password: validatePassword(password),
    }
    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.nickname || nextErrors.password) return

    setPending(true)
    try {
      await login({ nickname: nickname.trim(), password })
      navigate(routes.intro, { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось войти')
    } finally {
      setPending(false)
    }
  }

  return (
    <PageShell fadedTrack headerSlot={<BackLink />}>
      <AuthCard
        fileLabel="Дело № 001"
        stamp="Секретно"
        title="Вход"
        subtitle="Детектив, трасса ждёт. Предъявите удостоверение."
        footer={
          <>
            Ещё нет аккаунта? <Link to={routes.register}>Зарегистрироваться</Link>
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
            value={nickname}
            error={errors.nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            placeholder="........"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="auth-form__submit" type="submit" block disabled={pending}>
            {pending ? 'Проверяем…' : 'Войти'}
          </Button>
        </form>
      </AuthCard>
    </PageShell>
  )
}
