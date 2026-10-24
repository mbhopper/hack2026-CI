import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { IntroPage } from './pages/IntroPage.tsx'
import { TrackPage } from './pages/TrackPage.tsx'
import { SuspectsPage } from './pages/SuspectsPage.tsx'
import { InterrogationPage } from './pages/InterrogationPage.tsx'
import { RequireAuth } from './auth/RequireAuth.tsx'
import { routes } from './routes.ts'

export default function App() {
  return (
    <Routes>
      <Route path={routes.home} element={<HomePage />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
      <Route
        path={routes.intro}
        element={
          <RequireAuth>
            <IntroPage />
          </RequireAuth>
        }
      />
      <Route
        path={routes.track}
        element={
          <RequireAuth>
            <TrackPage />
          </RequireAuth>
        }
      />
      <Route
        path={routes.suspects}
        element={
          <RequireAuth>
            <SuspectsPage />
          </RequireAuth>
        }
      />
      <Route
        path={routes.interrogation(':id')}
        element={
          <RequireAuth>
            <InterrogationPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  )
}
