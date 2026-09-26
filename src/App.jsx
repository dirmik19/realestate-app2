import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PropertiesPage from './pages/PropertiesPage'

// 画面のルーティング設定
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertiesPage />
              </ProtectedRoute>
            }
          />
          {/* それ以外のURLは物件一覧へ（未ログインならログイン画面へ転送される） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
