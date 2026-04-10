import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { CSSProperties } from 'react'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/Home/HomePage'
import LoginChoicePage from './pages/Login/LoginChoicePage'
import LoginFormPage from './pages/Login/LoginFormPage'
import RegisterPage from './pages/Register/RegisterPage'
import ProfilePage from './pages/Profile/ProfilePage'
import RewardsPage from './pages/Rewards/RewardsPage'
import VerifyPage from './pages/Verify/VerifyPage'
import StaffPage from './pages/Staff/StaffPage'
import { LanguageProvider } from './i18n/LanguageContext'
import ContactPage from './pages/Contact/ContactPage'
import PartnersPage from './pages/Partners/PartnersPage'
import vectorWatermark from './assets/Vector.png'

function App() {
  const appStyle = {
    '--weco-watermark': `url(${vectorWatermark})`,
  } as CSSProperties

  return (
    <LanguageProvider>
      <div style={appStyle}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginChoicePage />} />
            <Route path="/login/form" element={<LoginFormPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  )
}

export default App
