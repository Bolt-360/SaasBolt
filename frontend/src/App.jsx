import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import AuthPage from './pages/auth';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/auth" />; // Se o token não estiver presente, redireciona para a página de login
  }

  return children; // Se o token estiver presente, renderiza o componente da rota protegida
};

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
        />
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;