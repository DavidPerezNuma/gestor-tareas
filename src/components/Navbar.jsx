import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <Link to={usuario ? '/tareas' : '/login'} className="navbar__marca">
        <span className="navbar__logo" aria-hidden="true">✓</span>
        Gestor de Tareas
      </Link>
      {usuario && (
        <div className="navbar__usuario">
          <span className="navbar__nombre" title={usuario.correo}>
            Hola, <strong>{usuario.nombre}</strong>
          </span>
          <button type="button" className="btn btn--secundario btn--sm" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
