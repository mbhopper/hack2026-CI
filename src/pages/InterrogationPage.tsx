import { Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/Button.tsx'
import { DialogueBox } from '../components/DialogueBox.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { dialogues, type Topic } from '../game/dialogues.ts'
import { PORTRAIT_SIZE, suspectPortraits } from '../game/portraits.ts'
import { suspects, type Suspect } from '../game/story.ts'
import { useConversation } from '../game/useConversation.ts'
import { useMusic } from '../game/useMusic.ts'
import { routes } from '../routes.ts'
import './SuspectsPage.css'
import './InterrogationPage.css'

export function InterrogationPage() {
  useMusic('interrogation')
  const { id } = useParams()
  const suspect = suspects.find((item) => item.id === id)
  if (!suspect) return <Navigate to={routes.suspects} replace />
  return <Interrogation key={suspect.id} suspect={suspect} topics={dialogues[suspect.id] ?? []} />
}

function Interrogation({ suspect, topics }: { suspect: Suspect; topics: Topic[] }) {
  const talk = useConversation(suspect.id, topics, 'calm')
  const { facts } = talk

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Допрос" />}>
      <div className="talk">
        <aside className="talk__suspect">
          <div className="suspects__portrait">
            <img
              className="talk__portrait"
              src={suspectPortraits[suspect.id][talk.mood]}
              alt={suspect.name}
              width={PORTRAIT_SIZE * 3}
              height={PORTRAIT_SIZE * 3}
            />
          </div>
          <p className="suspects__role">{suspect.role}</p>
          <h1 className="talk__name">{suspect.name}</h1>
        </aside>

        <DialogueBox talk={talk} speaker={suspect.name} placeholder="Выберите вопрос, чтобы начать допрос." />

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
            <span className="btn__arrow" aria-hidden="true">
              ←
            </span>
            К подозреваемым
          </ButtonLink>
        </section>
      </div>
    </PageShell>
  )
}
