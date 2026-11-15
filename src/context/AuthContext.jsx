import { createContext, useContext, useState } from 'react';
import { sha256 } from '../utils/hash';
import {
  obtenerUsuarios,
  guardarUsuarios,
  obtenerSesion,
  guardarSesion,
  borrarSesion,
  generarId,
} from '../utils/storage';

const AuthContext = createContext(null);

/** Recupera la sesión guardada solo si el usuario todavía existe. */
function sesionInicial() {
  const sesion = obtenerSesion();
  if (!sesion) return null;
  const existe = obtenerUsuarios().some((u) => u.id === sesion.id);
  if (!existe) borrarSesion();
  return existe ? sesion : null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(sesionInicial);

  const iniciarSesionCon = (u) => {
    const sesion = { id: u.id, nombre: u.nombre, correo: u.correo };
    guardarSesion(sesion);
    setUsuario(sesion);
  };

  const registrar = async ({ nombre, correo, password }) => {
    const usuarios = obtenerUsuarios();
    const correoNormalizado = correo.trim().toLowerCase();
    if (usuarios.some((u) => u.correo === correoNormalizado)) {
      throw new Error('Ya existe una cuenta registrada con ese correo.');
    }
    const nuevo = {
      id: generarId(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      passwordHash: await sha256(password),
      creadoEn: new Date().toISOString(),
    };
    guardarUsuarios([...usuarios, nuevo]);
    iniciarSesionCon(nuevo);
  };

  const login = async ({ correo, password }) => {
    const correoNormalizado = correo.trim().toLowerCase();
    const encontrado = obtenerUsuarios().find((u) => u.correo === correoNormalizado);
    const hash = await sha256(password);
    if (!encontrado || encontrado.passwordHash !== hash) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    iniciarSesionCon(encontrado);
  };

  const logout = () => {
    borrarSesion();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, registrar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
