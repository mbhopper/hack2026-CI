import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { IntroPage } from './pages/IntroPage.tsx'
import { LocationsPage } from './pages/LocationsPage.tsx'
import { LocationPage } from './pages/LocationPage.tsx'
import { SuspectsPage } from './pages/SuspectsPage.tsx'
import { InterrogationPage } from './pages/InterrogationPage.tsx'
import { AccusationPage } from './pages/AccusationPage.tsx'
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
        path={routes.locations}
        element={
          <RequireAuth>
            <LocationsPage />
          </RequireAuth>
        }
      />
      <Route
        path={routes.location(':id')}
        element={
          <RequireAuth>
            <LocationPage />
          </RequireAuth>
        }
      />
      <Route path="/track" element={<Navigate to={routes.location('crash-site')} replace />} />
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
      <Route
        path={routes.accusation(':id')}
        element={
          <RequireAuth>
            <AccusationPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  )
}
