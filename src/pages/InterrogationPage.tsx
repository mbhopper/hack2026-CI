import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { PixelSprite } from '../components/PixelSprite.tsx'
import { canAsk, questionKey, questions, type Question } from '../game/dialogue.ts'
import { personSprite } from '../game/sprites.ts'
import { factById, suspects, type Suspect } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'
import './InterrogationPage.css'

export function InterrogationPage() {
  const { id } = useParams()
  const suspect = suspects.find((item) => item.id === id)
  if (!suspect) return <Navigate to={routes.suspects} replace />
  // key: при переходе к другому подозреваемому разговор начинается заново
  return <Interrogation key={suspect.id} suspect={suspect} />
}

function Interrogation({ suspect }: { suspect: Suspect }) {
  const { state, dispatch } = useGame()
  const [current, setCurrent] = useState<Question | null>(null)
  const [noted, setNoted] = useState<string[]>([])

  const list = questions[suspect.id] ?? []
  const open = list.filter((question) => canAsk(state, question))
  const locked = list.length - open.length

  const ask = (question: Question) => {
    const key = questionKey(suspect.id, question.id)
    const fresh = (question.facts ?? []).filter((fact) => !state.facts.includes(fact))
    setCurrent(question)
    setNoted(fresh)
    if (!state.asked.includes(key) || fresh.length) dispatch({ type: 'ask', id: key, facts: question.facts ?? [] })
  }

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Допрос" />}>
      <div className="talk">
        <aside className="talk__who">
          <div className="suspects__portrait">
            <PixelSprite sprite={personSprite(suspect.sprite, suspect.outfit)} scale={8} label={suspect.name} />
          </div>
          <p className="suspects__role">{suspect.role}</p>
          <h1 className="talk__name">{suspect.name}</h1>
        </aside>

        <section className="talk__panel">
          <div className="talk__log" aria-live="polite">
            {current ? (
              <>
                <p className="talk__line talk__line--detective">
                  <b>Вы:</b> {current.ask}
                </p>
                {current.answer.map((line, i) => (
                  <p
                    key={`${current.id}-${i}`}
                    className={`talk__line talk__line--${line.who}`}
                    style={{ animationDelay: `${(i + 1) * 0.35}s` }}
                  >
                    <b>{line.who === 'detective' ? 'Вы' : suspect.name}:</b> {line.text}
                  </p>
                ))}
                {noted.length > 0 && (
                  <p className="talk__noted" style={{ animationDelay: `${(current.answer.length + 1) * 0.35}s` }}>
                    Записано в блокнот: {noted.map((fact) => factById(fact)?.text).join(' ')}
                  </p>
                )}
              </>
            ) : (
              <p className="talk__placeholder">{suspect.summary} Выберите вопрос.</p>
            )}
          </div>

          <ul className="talk__questions">
            {open.map((question) => {
              const asked = state.asked.includes(questionKey(suspect.id, question.id))
              return (
                <li key={question.id}>
                  <button
                    type="button"
                    className="talk__ask"
                    data-asked={asked}
                    aria-pressed={current?.id === question.id}
                    onClick={() => ask(question)}
                  >
                    {question.ask}
                  </button>
                </li>
              )
            })}
          </ul>
          {locked > 0 && (
            <p className="talk__locked">
              Ещё {locked} {locked === 1 ? 'вопрос откроется' : 'вопроса откроются'}, когда найдёте новые улики или
              показания.
            </p>
          )}
        </section>

        <nav className="talk__others" aria-label="Другие подозреваемые">
          {suspects
            .filter((other) => other.id !== suspect.id)
            .map((other) => (
              <ButtonLink key={other.id} to={routes.interrogation(other.id)} variant="ghost">
                {other.name}
              </ButtonLink>
            ))}
          <ButtonLink to={routes.suspects} variant="ghost">
            ← Все подозреваемые
          </ButtonLink>
          <ButtonLink to={routes.accuse}>Выдвинуть обвинение</ButtonLink>
        </nav>
      </div>
    </PageShell>
  )
}
