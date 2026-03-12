import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/Home/HomePage'
import LoginChoicePage from './pages/Login/LoginChoicePage'
import LoginFormPage from './pages/Login/LoginFormPage'
import RegisterPage from './pages/Register/RegisterPage'
import ProfilePage from './pages/Profile/ProfilePage'
import RewardsPage from './pages/Rewards/RewardsPage'
import VerifyPage from './pages/Verify/VerifyPage'
import StaffPage from './pages/Staff/StaffPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginChoicePage />} />
        <Route path="/login/form" element={<LoginFormPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
