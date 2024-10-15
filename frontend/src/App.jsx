import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
import WebAppPage from './pages/webApp'
import ChatPage from './pages/chat'
import AppLayout from './layouts/AppLayout'
import NotFoundPage from './pages/404'
import { useAuthContext } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WorkspaceSetup from './pages/WorkspaceSetup'

function App() {
  const { authUser } = useAuthContext();
  
  return (
    <ProtectedRoute>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route 
          path='/auth' 
          element={authUser ? <Navigate to="/app" /> : <AuthPage />} 
        />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/cadastro' element={<AuthPage />} />
        <Route path='/workspace-setup' element={<WorkspaceSetup />} />
        <Route 
          path='/app'
          element={<AppLayout />}
        >
          <Route index element={<WebAppPage />} />
          <Route path='chat' element={<ChatPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </ProtectedRoute>
  )
}

export default App
