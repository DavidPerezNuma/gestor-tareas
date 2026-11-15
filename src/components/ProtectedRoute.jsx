import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Solo deja pasar si hay una sesión activa; si no, redirige a /login. */
export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  return children;
}
