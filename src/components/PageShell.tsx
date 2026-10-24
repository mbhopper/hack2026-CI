import type { ReactNode } from 'react'
import { Logo } from './Logo.tsx'
import { TrackBackdrop } from './TrackBackdrop.tsx'
import './PageShell.css'

interface PageShellProps {
  children: ReactNode
  /** Правый угол шапки: счётчик кругов или ссылка назад */
  headerSlot?: ReactNode
  /** Подписи в подвале — только на главной */
  footerSlot?: ReactNode
  fadedTrack?: boolean
  withCar?: boolean
}

export function PageShell({ children, headerSlot, footerSlot, fadedTrack, withCar }: PageShellProps) {
  return (
    <div className="shell">
      <TrackBackdrop faded={fadedTrack} withCar={withCar} />

      <header className="shell__header">
        <Logo />
        {headerSlot && <div className="shell__header-slot">{headerSlot}</div>}
      </header>

      <main className="shell__main">{children}</main>

      <div className="shell__chequer" aria-hidden="true" />

      <footer className="shell__footer">{footerSlot}</footer>
    </div>
  )
}
