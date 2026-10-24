import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { PlayPage } from './pages/PlayPage.tsx'
import { IntroPage } from './pages/IntroPage.tsx'
import { LocationRoute } from './pages/LocationPage.tsx'
import { SuspectsPage } from './pages/SuspectsPage.tsx'
import { InterrogationPage } from './pages/InterrogationPage.tsx'
import { AccusePage } from './pages/AccusePage.tsx'
import { EndingPage } from './pages/EndingPage.tsx'
import { CareerPage } from './pages/CareerPage.tsx'
import { RequireAuth } from './auth/RequireAuth.tsx'
import { RequireInspection } from './game/RequireInspection.tsx'
import { ScrollToTop } from './components/ScrollToTop.tsx'
import { routes } from './routes.ts'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
        <Route
          path={routes.play}
          element={
            <RequireAuth>
              <PlayPage />
            </RequireAuth>
          }
        />
        <Route
          path={routes.intro}
          element={
            <RequireAuth>
              <IntroPage />
            </RequireAuth>
          }
        />
        <Route
          path={routes.inspect(':id')}
          element={
            <RequireAuth>
              <LocationRoute />
            </RequireAuth>
          }
        />
        {/* старый адрес осмотра из первой версии */}
        <Route path="/track" element={<Navigate to={routes.inspect('track')} replace />} />
        <Route
          path={routes.suspects}
          element={
            <RequireAuth>
              <RequireInspection>
                <SuspectsPage />
              </RequireInspection>
            </RequireAuth>
          }
        />
        <Route
          path={routes.interrogation(':id')}
          element={
            <RequireAuth>
              <RequireInspection>
                <InterrogationPage />
              </RequireInspection>
            </RequireAuth>
          }
        />
        <Route
          path={routes.accuse}
          element={
            <RequireAuth>
              <RequireInspection>
                <AccusePage />
              </RequireInspection>
            </RequireAuth>
          }
        />
        <Route
          path={routes.ending}
          element={
            <RequireAuth>
              <RequireInspection>
                <EndingPage />
              </RequireInspection>
            </RequireAuth>
          }
        />
        <Route
          path={routes.career}
          element={
            <RequireAuth>
              <RequireInspection>
                <CareerPage />
              </RequireInspection>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Routes>
    </>
  )
}
