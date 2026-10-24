import { Link } from 'react-router-dom'
import { routes } from '../routes.ts'
import './BackLink.css'

export function BackLink() {
  return (
    <Link className="back-link" to={routes.home}>
      ← На главную
    </Link>
  )
}
