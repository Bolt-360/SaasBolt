import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
import WebAppPage from './pages/webApp'
import ChatPage from './pages/chat'
import AppLayout from './layouts/AppLayout'
import NotFoundPage from './pages/404'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/app' element={<AppLayout />}>
          <Route index element={<WebAppPage />} />
          <Route path='chat' element={<ChatPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
