import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster />
        <SocketContextProvider>
          <App/>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
