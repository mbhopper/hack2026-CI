import { difficulties } from '../game/difficulty.ts'
import { useGame } from '../game/useGame.ts'
import './DifficultyPicker.css'

/** Выбор сложности; меняется в любой момент и сохраняется вместе с делом */
export function DifficultyPicker() {
  const { state, dispatch } = useGame()
  const current = difficulties.find((item) => item.id === state.difficulty) ?? difficulties[1]
  // после первого обвинения сложность не меняем, иначе можно обойти лимит попыток
  const locked = state.attempts > 0

  return (
    <fieldset className="difficulty" disabled={locked}>
      <legend>Сложность</legend>
      <div className="difficulty__options">
        {difficulties.map((item) => (
          <label key={item.id} data-checked={item.id === state.difficulty}>
            <input
              type="radio"
              name="difficulty"
              value={item.id}
              checked={item.id === state.difficulty}
              onChange={() => dispatch({ type: 'difficulty', difficulty: item.id })}
            />
            {item.title}
          </label>
        ))}
      </div>
      <p className="difficulty__text">
        {current.text}
        {locked && ' Сменить сложность можно в новом деле.'}
      </p>
    </fieldset>
  )
}
