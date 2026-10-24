import { Navigate, useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '../components/Button.tsx'
import { GameHeader } from '../components/GameHeader.tsx'
import { PageShell } from '../components/PageShell.tsx'
import { verdict } from '../game/accusation.ts'
import { questions } from '../game/dialogue.ts'
import { clues, facts } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { routes } from '../routes.ts'
import './CareerPage.css'

const totalQuestions = Object.values(questions).reduce((sum, list) => sum + list.length, 0)

/** Экран после раскрытого дела: чем на самом деле занимается детектив */
export function CareerPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  if (!state.accusation || verdict(state.accusation) !== 'solved') return <Navigate to={routes.play} replace />

  const skills = [
    {
      name: 'Наблюдательность',
      score: `${state.found.length} из ${clues.length} улик`,
      text: 'Осмотр места происшествия: заметить отсутствие следов торможения важнее, чем разглядывать обломки.',
    },
    {
      name: 'Работа с людьми',
      score: `${state.asked.length} из ${totalQuestions} вопросов`,
      text: 'Допрос — это не давление, а правильный вопрос в правильный момент. Механик сам вспомнил пятого человека.',
    },
    {
      name: 'Аналитика',
      score: `${state.facts.length} из ${facts.length} показаний`,
      text: 'Сопоставить время на турникете, телеметрию и график смены — и увидеть, что 16 минут спонсора совпадают с пит-стопом.',
    },
    {
      name: 'Доказательность',
      score: state.attempts === 1 ? 'с первой попытки' : `с ${state.attempts}-й попытки`,
      text: 'Суд принимает не догадку, а цепочку: кто, как и зачем. Без мотива и способа даже верный подозреваемый уходит.',
    },
  ]

  const restart = () => {
    dispatch({ type: 'reset' })
    navigate(routes.play)
  }

  return (
    <PageShell fadedTrack headerSlot={<GameHeader label="Профессия" />}>
      <article className="career">
        <p className="career__kicker">Профессия</p>
        <h1 className="career__title">Детектив</h1>
        <p className="career__lead">
          Вы только что сделали то, чем каждый день занимаются следователи и детективы: осмотрели место, собрали
          улики, опросили свидетелей и доказали версию.
        </p>

        <section>
          <h2>Ваши навыки в этом деле</h2>
          <ul className="career__skills">
            {skills.map((skill) => (
              <li key={skill.name}>
                <h3>
                  {skill.name} <span>{skill.score}</span>
                </h3>
                <p>{skill.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Где работают детективы</h2>
          <ul className="career__list">
            <li>
              <b>Следователь</b> в Следственном комитете или МВД ведёт уголовные дела от осмотра места до передачи в суд.
            </li>
            <li>
              <b>Частный детектив</b> работает по лицензии: ищет людей и имущество, собирает сведения для судебных дел.
            </li>
            <li>
              <b>Служба безопасности банка</b> расследует мошенничество, проверяет подозрительные операции и
              контрагентов. В этом деле всё решил страховой полис — такие схемы ищут и в банках.
            </li>
            <li>
              <b>Страховой расследователь</b> проверяет, не подстроен ли страховой случай.
            </li>
          </ul>
        </section>

        <section>
          <h2>Как стать</h2>
          <p className="career__text">
            Основной путь — юридическое образование: юридический факультет университета или вуз МВД. Для экономических
            и банковских расследований подходят направления «Экономическая безопасность» и «Финансы». Частному
            детективу нужна лицензия по закону «О частной детективной и охранной деятельности».
          </p>
        </section>

        <div className="career__actions">
          <Button onClick={restart}>Сыграть ещё раз</Button>
          <ButtonLink to={routes.home} variant="ghost">
            На главную
          </ButtonLink>
        </div>
      </article>
    </PageShell>
  )
}
