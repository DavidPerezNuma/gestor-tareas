import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REGEX_CORREO } from '../utils/constants';

function validar({ nombre, correo, password, confirmar }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio.';
  else if (nombre.trim().length < 2) errores.nombre = 'El nombre debe tener al menos 2 caracteres.';

  if (!correo.trim()) errores.correo = 'El correo es obligatorio.';
  else if (!REGEX_CORREO.test(correo.trim())) errores.correo = 'Ingresa un correo válido.';

  if (!password) errores.password = 'La contraseña es obligatoria.';
  else if (password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres.';

  if (!confirmar) errores.confirmar = 'Confirma tu contraseña.';
  else if (confirmar !== password) errores.confirmar = 'Las contraseñas no coinciden.';
  return errores;
}

export default function Register() {
  const { usuario, registrar } = useAuth();
  const navigate = useNavigate();
  const [valores, setValores] = useState({ nombre: '', correo: '', password: '', confirmar: '' });
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
      await registrar(valores);
      navigate('/tareas', { replace: true });
    } catch (err) {
      setErrorGeneral(err.message);
      setEnviando(false);
    }
  };

  const campo = (name, label, type = 'text', autoComplete, placeholder) => (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={valores[name]}
        onChange={cambiar}
        className={errores[name] ? 'invalido' : ''}
      />
      {errores[name] && <p className="campo__error">{errores[name]}</p>}
    </div>
  );

  return (
    <main className="auth">
      <div className="auth__tarjeta">
        <h1>Crear cuenta</h1>
        <p className="auth__subtitulo">Regístrate para empezar a organizar tus tareas.</p>

        {errorGeneral && (
          <div className="alerta alerta--error" role="alert">
            {errorGeneral}
          </div>
        )}

        <form className="formulario" onSubmit={enviar} noValidate>
          {campo('nombre', 'Nombre completo', 'text', 'name', 'Tu nombre')}
          {campo('correo', 'Correo electrónico', 'email', 'email', 'tucorreo@ejemplo.com')}
          {campo('password', 'Contraseña', 'password', 'new-password', 'Mínimo 6 caracteres')}
          {campo('confirmar', 'Confirmar contraseña', 'password', 'new-password')}

          <button type="submit" className="btn btn--primario btn--bloque" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth__pie">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
