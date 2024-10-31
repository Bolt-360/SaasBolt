import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home'
import AuthPage from './pages/auth'
<<<<<<< HEAD
import WebAppPage from './pages/webApp'
import ChatPage from './pages/chat'
import AppLayout from './layouts/AppLayout'
import NotFoundPage from './pages/404'
import { useAuthContext } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WorkspaceSetup from './pages/WorkspaceSetup'
import CampanhasLayout from './features/campanhas/CampanhasLayout'
import Dashboard from './features/campanhas/page'
import ListarInstancias from './features/campanhas/ListarInstancias/page'
import Disparador from './features/campanhas/Disparador/page'
import Configuracoes from './features/campanhas/Configuracoes/page'
import CriarInstancia from './features/campanhas/CriarInstancia/page'
import ListarCampanhas from './features/campanhas/ListarCampanhas/page'
import PipefullLayout from './features/pipefull/PipefullLayout'
import DashboardPipefull from './features/pipefull/page.jsx'
import MyTasks from './features/pipefull/Tasks/page.jsx'
import MyMembers from './features/pipefull/Members/page'

=======
import { SignInCard } from './features/auth/components/sign-in-card'
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209

function App() {
  const { authUser } = useAuthContext();
  
  return (
    <ProtectedRoute>
      <Routes>
        <Route path='/' element={<HomePage />} />
<<<<<<< HEAD
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
          <Route path='pipefull' element={<PipefullLayout />}>
            <Route index element={<DashboardPipefull/>} />
            <Route path='my-tasks' element={<MyTasks />}/>
            <Route path='members' element={<MyMembers />} />
          </Route>
          <Route path='campanhas' element={<CampanhasLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='listar-instancias' element={<ListarInstancias />} />
            <Route path='disparador' element={<Disparador />} />
            <Route path='configuracoes' element={<Configuracoes />} />
            <Route path='criar-instancia' element={<CriarInstancia />} />
            <Route path='listar-campanhas' element={<ListarCampanhas />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
=======
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/sign-in' element={<SignInCard />} />
>>>>>>> 19cf451cee8aad1c7797ed0b540fa0d2ded16209
      </Routes>
    </ProtectedRoute>
  )
}

export default App
