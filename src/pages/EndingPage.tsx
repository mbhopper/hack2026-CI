import { Navigate, useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { RevealScene } from '../components/RevealScene.tsx'
import { methods, motives, solution, verdict } from '../game/accusation.ts'
import { HARD_ATTEMPTS } from '../game/difficulty.ts'
import { suspects } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './EndingPage.css'

const wrongSuspect: Record<string, string> = {
  pilot:
    'Пилота №22 отстранили от гонок до суда. Через месяц дело развалилось: против него не нашлось ни одной улики, только старое соперничество.',
  mechanic:
    'Механик так и остался в изоляторе. Он твердил про пятого человека у кокпита, но пятого никто не искал.',
}

export function EndingPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  if (!state.accusation) return <Navigate to={routes.accuse} replace />

  const result = verdict(state.accusation)
  const restart = () => {
    dispatch({ type: 'reset' })
    navigate(routes.play)
  }

  if (result === 'solved') {
    return (
      <PageShell fadedTrack headerSlot={<GameHeader label="Дело закрыто" />}>
        <article className="ending">
          <p className="ending__stamp ending__stamp--good">Дело раскрыто</p>
          <h1 className="ending__title">Пятый механик</h1>
          <RevealScene />
          <div className="ending__story">
            <p>
              В 14:31 спонсор вышел из VIP-ложи. В боксе №7 он надел новый комбинезон команды без бейджа и надвинул
              кепку. Механики приняли его за человека от спонсора, по сути так и было.
            </p>
            <p>
              В 14:38, пока меняли шины, он наклонился в кокпит и зафиксировал круиз-контроль на максимуме. Болид ушёл с
              пит-стопа и больше не сбросил скорость. В 14:47 спонсор вернулся в ложу, а комбинезон с VIP-браслетом в
              кармане бросил в корзину для белья.
            </p>
            <p>
              Мотив — страховка на 50 миллионов. Пилот №7 уходил из команды в конце сезона, и все вложения спонсора
              сгорали. Живой пилот уносил деньги к конкурентам, погибший приносил выплату.
            </p>
            <p>Механика бокса №7 освободили в тот же вечер.</p>
          </div>
          <p className="ending__meta">
            {state.attempts === 1 ? 'Раскрыто с первой попытки.' : `Раскрыто с попытки №${state.attempts}.`}
          </p>
          <div className="ending__actions">
            <ButtonLink to={routes.career}>Кто такой детектив</ButtonLink>
            <Button variant="ghost" onClick={restart}>
              Сыграть ещё раз
            </Button>
          </div>
        </article>
      </PageShell>
    )
  }

  const outOfAttempts = state.difficulty === 'hard' && state.attempts >= HARD_ATTEMPTS
  const accused = suspects.find((item) => item.id === state.accusation?.suspect)
  const wrongParts = [
    state.accusation.method !== solution.method &&
      (state.difficulty === 'easy'
        ? `способ («${methods.find((m) => m.id === state.accusation?.method)?.text}»)`
        : 'способ'),
    state.accusation.motive !== solution.motive &&
      (state.difficulty === 'easy'
        ? `мотив («${motives.find((m) => m.id === state.accusation?.motive)?.text}»)`
        : 'мотив'),
  ].filter(Boolean)

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Суд" />}>
      <article className="ending">
        <p className="ending__stamp ending__stamp--bad">{result === 'weak-case' ? 'Дело развалилось' : 'Ошибка следствия'}</p>
        <h1 className="ending__title">{result === 'weak-case' ? 'Версия не выдержала суда' : `Обвинён: ${accused?.name}`}</h1>
        <div className="ending__story">
          {result === 'wrong-suspect' ? (
            <>
              <p>{wrongSuspect[state.accusation.suspect]}</p>
              <p>Тем временем спонсор получил 50 миллионов страховки и улетел из страны.</p>
            </>
          ) : (
            <>
              <p>
                Вы правы насчёт спонсора, но адвокат разбил версию в суде
                {state.difficulty === 'hard' ? '.' : `: не сходится ${wrongParts.join(' и ')}.`}
              </p>
              <p>Дело вернули на доследование, спонсора отпустили под подписку о невыезде.</p>
            </>
          )}
        </div>
        {outOfAttempts && (
          <p className="ending__meta">
            Три ошибки подряд: дело передали другому следователю. Начните расследование заново.
          </p>
        )}
        <div className="ending__actions">
          {!outOfAttempts && <ButtonLink to={routes.suspects}>Вернуться к делу</ButtonLink>}
          <Button variant={outOfAttempts ? 'primary' : 'ghost'} onClick={restart}>
            Начать заново
          </Button>
        </div>
      </article>
    </PageShell>
  )
}
