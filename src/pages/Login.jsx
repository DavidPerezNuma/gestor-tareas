import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REGEX_CORREO } from '../utils/constants';

function validar({ correo, password }) {
  const errores = {};
  if (!correo.trim()) errores.correo = 'El correo es obligatorio.';
  else if (!REGEX_CORREO.test(correo.trim())) errores.correo = 'Ingresa un correo válido.';
  if (!password) errores.password = 'La contraseña es obligatoria.';
  return errores;
}

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [valores, setValores] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/tareas" replace />;

  const cambiar = (e) => {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: undefined }));
    setErrorGeneral('');
  };

  const enviar = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await login(valores);
      navigate(location.state?.desde || '/tareas', { replace: true });
    } catch (err) {
      setErrorGeneral(err.message);
      setEnviando(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__tarjeta">
        <h1>Iniciar sesión</h1>
        <p className="auth__subtitulo">Accede para gestionar tus tareas.</p>

        {errorGeneral && (
          <div className="alerta alerta--error" role="alert">
            {errorGeneral}
          </div>
        )}

        <form className="formulario" onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              value={valores.correo}
              onChange={cambiar}
              className={errores.correo ? 'invalido' : ''}
            />
            {errores.correo && <p className="campo__error">{errores.correo}</p>}
          </div>

          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={valores.password}
              onChange={cambiar}
              className={errores.password ? 'invalido' : ''}
            />
            {errores.password && <p className="campo__error">{errores.password}</p>}
          </div>

          <button type="submit" className="btn btn--primario btn--bloque" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth__pie">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
