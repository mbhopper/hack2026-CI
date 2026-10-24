import { useMemo, useRef, useState } from 'react'
import { finishPhotoCanvas } from '../game/photo.ts'
import { clueById, factById, locations, suspects } from '../game/story.ts'
import { useGame } from '../game/useGame.ts'
import { PixelSprite } from './PixelSprite.tsx'
import './Notebook.css'

const caseFile = { id: 'case', title: 'Материалы дела' }

/** Блокнот детектива: кнопка в шапке и выезжающая панель со всеми уликами и показаниями */
export function Notebook() {
  const { state } = useGame()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const photo = useMemo(() => finishPhotoCanvas(), [])

  const found = state.found.map(clueById).filter((clue) => clue !== undefined)
  const groups = [caseFile, ...locations]
    .map((place) => ({ ...place, clues: found.filter((clue) => clue.location === place.id) }))
    .filter((group) => group.clues.length > 0)
  const notes = state.facts.map(factById).filter((fact) => fact !== undefined)

  const close = () => dialogRef.current?.close()

  return (
    <>
      <button type="button" className="notebook__toggle" onClick={() => dialogRef.current?.showModal()}>
        Блокнот <span>{found.length + notes.length}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="notebook"
        aria-labelledby="notebook-title"
        onClick={(event) => {
          // клик по затемнению вокруг панели закрывает блокнот
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="notebook__sheet">
          <header className="notebook__head">
            <h2 id="notebook-title">Блокнот детектива</h2>
            <button type="button" className="notebook__close" onClick={close} aria-label="Закрыть блокнот">
              ✕
            </button>
          </header>

          <section>
            <h3>Улики</h3>
            {groups.map((group) => (
              <div key={group.id} className="notebook__group">
                <p className="notebook__place">{group.title}</p>
                <ul>
                  {group.clues.map((clue) => {
                    const open = openId === clue.id
                    return (
                      <li key={clue.id}>
                        <button
                          type="button"
                          className="notebook__clue"
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : clue.id)}
                        >
                          {clue.title}
                        </button>
                        {open && (
                          <div className="notebook__detail">
                            {clue.id === 'finish-photo' && (
                              <PixelSprite className="notebook__photo" sprite={photo} scale={2} label="Фото с финиша" />
                            )}
                            <p>{clue.note}</p>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3>Показания</h3>
            {notes.length === 0 ? (
              <p className="notebook__empty">Пока никого не допросили.</p>
            ) : (
              <ul>
                {notes.map((fact) => (
                  <li key={fact.id} className="notebook__fact">
                    <b>{suspects.find((suspect) => suspect.id === fact.suspect)?.name}:</b> {fact.text}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </dialog>
    </>
  )
}
