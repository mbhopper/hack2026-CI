import logoUrl from '../assets/center-invest-logo.png'
import './Logo.css'

export function Logo() {
  return (
    <span className="logo">
      <img className="logo__image" src={logoUrl} alt="Банк «Центр-инвест»" width={333} height={70} />
    </span>
  )
}
