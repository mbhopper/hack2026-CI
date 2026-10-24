import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/press-start-2p/cyrillic-400.css'
import '@fontsource/press-start-2p/latin-400.css'
import '@fontsource/montserrat/cyrillic-400.css'
import '@fontsource/montserrat/cyrillic-600.css'
import '@fontsource/montserrat/cyrillic-700.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-600.css'
import '@fontsource/montserrat/latin-700.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
