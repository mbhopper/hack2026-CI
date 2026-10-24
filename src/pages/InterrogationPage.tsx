import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { dialogues, topicKey, type Topic } from '../game/dialogues.ts'
import { PORTRAIT_SIZE, detectivePortraits, suspectPortraits, type Mood } from '../game/portraits.ts'
import { loadProgress, saveProgress } from '../game/progress.ts'
import { suspects, type Suspect } from '../game/story.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'
import './InterrogationPage.css'

/** Символов в секунду у печатающегося ответа */
const TYPE_SPEED = 45
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function InterrogationPage() {
  const { id } = useParams()
  const suspect = suspects.find((item) => item.id === id)
  if (!suspect) return <Navigate to={routes.suspects} replace />
  return <Interrogation key={suspect.id} suspect={suspect} topics={dialogues[suspect.id] ?? []} />
}

function Interrogation({ suspect, topics }: { suspect: Suspect; topics: Topic[] }) {
  const { user } = useAuth()
  const [asked, setAsked] = useState<string[]>(() => (user ? loadProgress(user.id).asked : []))
  const [topicId, setTopicId] = useState<string | null>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [instant] = useState(reducedMotion)

  const topic = topics.find((item) => item.id === topicId) ?? null
  const line = topic?.lines[lineIndex]
  const shown = instant ? Infinity : chars
  const typing = line !== undefined && shown < line.text.length
  const finished = topic !== null && lineIndex === topic.lines.length - 1 && !typing
  const isAsked = (other: string) => asked.includes(topicKey(suspect.id, other))

  /** Вопрос считается заданным, только когда ответ дослушан до конца */
  const markHeard = (heardId: string) => {
    if (isAsked(heardId)) return
    const next = [...asked, topicKey(suspect.id, heardId)]
    setAsked(next)
    if (user) saveProgress(user.id, { asked: next })
  }

  const revealLine = (index: number) => {
    if (!topic) return
    setLineIndex(index)
    setChars(topic.lines[index].text.length)
    if (index === topic.lines.length - 1) markHeard(topic.id)
  }

  // посимвольная печать текущей реплики
  useEffect(() => {
    if (!line || !typing) return
    const timer = window.setTimeout(() => {
      if (chars + 1 >= line.text.length) revealLine(lineIndex)
      else setChars(chars + 1)
    }, 1000 / TYPE_SPEED)
    return () => window.clearTimeout(timer)
  })

  const advance = () => {
    if (!topic || !line) return
    if (typing) revealLine(lineIndex)
    else if (lineIndex < topic.lines.length - 1) {
      if (instant) revealLine(lineIndex + 1)
      else {
        setLineIndex(lineIndex + 1)
        setChars(0)
      }
    }
  }

  useEffect(() => {
    if (!topic || finished) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const start = (nextTopicId: string) => {
    setTopicId(nextTopicId)
    setLineIndex(0)
    setChars(0)
    const lines = topics.find((item) => item.id === nextTopicId)?.lines ?? []
    if (instant && lines.length === 1) markHeard(nextTopicId)
  }

  // эмоция на портрете — от последней реплики подозреваемого
  const spoken = topic ? topic.lines.slice(0, lineIndex + 1) : []
  const lastAnswer = [...spoken].reverse().find((item) => item.by === 'suspect')
  const mood: Mood = lastAnswer?.by === 'suspect' ? lastAnswer.mood : 'calm'

  const available = topics.filter((item) => !item.requires || isAsked(item.requires))
  const facts = topics.filter((item) => item.fact && isAsked(item.id))

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Допрос" />}>
      <div className="talk">
        <aside className="talk__suspect">
          <div className="suspects__portrait">
            <img
              className="talk__portrait"
              src={suspectPortraits[suspect.id][mood]}
              alt={suspect.name}
              width={PORTRAIT_SIZE * 3}
              height={PORTRAIT_SIZE * 3}
            />
          </div>
          <p className="suspects__role">{suspect.role}</p>
          <h1 className="talk__name">{suspect.name}</h1>
        </aside>

        <section className="talk__dialogue">
          <div
            className="talk__log"
            aria-live="polite"
            onClick={finished ? undefined : advance}
            data-waiting={topic !== null && !finished}
          >
            {topic ? (
              spoken.map((item, i) => (
                <div key={i} className={`talk__line talk__line--${item.by}`}>
                  {item.by === 'detective' && (
                    <img
                      className="talk__avatar"
                      src={item.sharp ? detectivePortraits.sharp : detectivePortraits.calm}
                      alt=""
                      width={PORTRAIT_SIZE}
                      height={PORTRAIT_SIZE}
                    />
                  )}
                  <p>
                    <b>{item.by === 'detective' ? 'Детектив' : suspect.name}</b>
                    {i === lineIndex ? item.text.slice(0, shown) : item.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="talk__placeholder">Выберите вопрос, чтобы начать допрос.</p>
            )}
            {topic && !finished && !typing && <span className="talk__more" aria-hidden="true">▼</span>}
          </div>

          {topic && !finished ? (
            <p className="talk__hint">Щелчок, пробел или Enter — дальше</p>
          ) : (
            <ul className="talk__questions">
              {available.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="talk__question"
                    data-asked={isAsked(item.id)}
                    onClick={() => start(item.id)}
                  >
                    <span aria-hidden="true">{isAsked(item.id) ? '✓' : '?'}</span>
                    {item.question}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="talk__notebook">
          <h2>
            Показания <span>{facts.length}/{topics.filter((item) => item.fact).length}</span>
          </h2>
          {facts.length ? (
            <ul>
              {facts.map((item) => (
                <li key={item.id}>{item.fact}</li>
              ))}
            </ul>
          ) : (
            <p className="talk__placeholder">Пока ничего не записано.</p>
          )}
          <ButtonLink to={routes.suspects} variant="ghost" block>
            ← К подозреваемым
          </ButtonLink>
        </section>
      </div>
    </PageShell>
  )
}
