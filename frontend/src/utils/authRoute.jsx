import { Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

const authRoute = ({ children }) => {
  const { authUser } = useAuthContext();

  // Se o usuário não está autenticado, redirecione para a página de autenticação
  return authUser ? children : <Navigate to="/auth" />;
};

export default authRoute;
