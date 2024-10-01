import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </div>
  )
}

export default App
