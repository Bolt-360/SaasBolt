import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
import WebAppPage from './pages/webApp'
import ChatPage from './pages/chat'
import AppLayout from './layouts/AppLayout'
import NotFoundPage from './pages/404'
import { useAuthContext } from './context/AuthContext'
import AuthRoute from './utils/authRoute'; 

function App() {
  const { authUser } = useAuthContext();
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route 
          path='/auth' 
          element={authUser ? <Navigate to="/app" /> : <AuthPage />} 
        />
        <Route 
          path='/app'
          element={<AuthRoute><AppLayout /></AuthRoute>} >
            <Route index element={<WebAppPage />} />
            <Route path='chat' element={<ChatPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
