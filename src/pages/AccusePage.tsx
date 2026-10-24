import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { methods, motives, type Option } from '../game/accusation.ts'
import { suspects } from '../game/story.ts'
import { questionKey, questions } from '../game/dialogue.ts'
import { HARD_ATTEMPTS } from '../game/difficulty.ts'
import { verdict } from '../game/accusation.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './AccusePage.css'

function Choice({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: Option[]
  value: string
  onChange(value: string): void
}) {
  return (
    <fieldset className="accuse__group">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option.id} className="accuse__option" data-checked={value === option.id}>
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          {option.text}
        </label>
      ))}
    </fieldset>
  )
}

export function AccusePage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [suspect, setSuspect] = useState(state.accusation?.suspect ?? '')
  const [method, setMethod] = useState(state.accusation?.method ?? '')
  const [motive, setMotive] = useState(state.accusation?.motive ?? '')
  const ready = suspect && method && motive
  // обвинять можно, только поговорив с каждым
  const silent = suspects.filter(
    (item) => !(questions[item.id] ?? []).some((question) => state.asked.includes(questionKey(item.id, question.id))),
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    dispatch({ type: 'accuse', accusation: { suspect, method, motive } })
    navigate(routes.ending)
  }

  // на сложном уровне после трёх ошибок дело забирают — только начать заново
  const outOfAttempts =
    state.difficulty === 'hard' &&
    state.attempts >= HARD_ATTEMPTS &&
    !(state.accusation && verdict(state.accusation) === 'solved')
  const solved = state.accusation !== null && verdict(state.accusation) === 'solved'
  // раскрытое дело не переобвинить, проигранное — тоже
  if (outOfAttempts || solved) return <Navigate to={routes.ending} replace />

  if (silent.length > 0) {
    return (
      <PageShell fadedTrack headerSlot={<GameHeader label="Обвинение" />}>
        <div className="accuse">
          <h1 className="accuse__title">Рано для обвинения</h1>
          <p className="accuse__lead">Сначала поговорите со всеми подозреваемыми. Ещё не допрошены:</p>
          <div className="accuse__actions">
            {silent.map((item) => (
              <ButtonLink key={item.id} to={routes.interrogation(item.id)}>
                {item.name}
              </ButtonLink>
            ))}
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Обвинение" />}>
      <form className="accuse" onSubmit={submit}>
        <h1 className="accuse__title">Обвинение</h1>
        <p className="accuse__lead">
          Соберите версию для суда. Ошибётесь — виновный уйдёт, а под подозрением останется невиновный.
        </p>

        <Choice
          name="suspect"
          legend="Кто убил пилота №7?"
          options={suspects.map((item) => ({ id: item.id, text: item.name }))}
          value={suspect}
          onChange={setSuspect}
        />
        <Choice name="method" legend="Как?" options={methods} value={method} onChange={setMethod} />
        <Choice name="motive" legend="Зачем?" options={motives} value={motive} onChange={setMotive} />

        <div className="accuse__actions">
          <Button type="submit" disabled={!ready}>
            Предъявить обвинение
          </Button>
          <ButtonLink to={routes.suspects} variant="ghost">
            Ещё подумать
          </ButtonLink>
        </div>
        {state.difficulty === 'hard' ? (
          <p className="accuse__attempts">
            Осталось попыток: {HARD_ATTEMPTS - state.attempts} из {HARD_ATTEMPTS}
          </p>
        ) : (
          state.attempts > 0 && <p className="accuse__attempts">Попыток уже было: {state.attempts}</p>
        )}
      </form>
    </PageShell>
  )
}
