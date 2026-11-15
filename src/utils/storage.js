/**
 * Capa de acceso a localStorage. Toda la persistencia de la app pasa por aquí.
 */
const CLAVES = {
  USUARIOS: 'gt_usuarios',
  SESION: 'gt_sesion',
  TAREAS: 'gt_tareas_', // + id del usuario
};

function leer(clave, valorPorDefecto) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
}

function escribir(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ---- Usuarios ----
export const obtenerUsuarios = () => leer(CLAVES.USUARIOS, []);
export const guardarUsuarios = (usuarios) => escribir(CLAVES.USUARIOS, usuarios);

// ---- Sesión ----
export const obtenerSesion = () => leer(CLAVES.SESION, null);
export const guardarSesion = (sesion) => escribir(CLAVES.SESION, sesion);
export const borrarSesion = () => localStorage.removeItem(CLAVES.SESION);

// ---- Tareas (separadas por usuario) ----
export const obtenerTareas = (usuarioId) => leer(CLAVES.TAREAS + usuarioId, []);
export const guardarTareas = (usuarioId, tareas) => escribir(CLAVES.TAREAS + usuarioId, tareas);

// ---- Utilidad ----
export function generarId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
