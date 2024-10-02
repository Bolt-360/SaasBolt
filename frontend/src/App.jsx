import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
import { SignInCard } from './features/auth/components/sign-in-card'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/sign-in' element={<SignInCard />} />
      </Routes>
    </div>
  )
}

export default App
