export const ESTADOS = ['Pendiente', 'En progreso', 'Completada'];
export const PRIORIDADES = ['Baja', 'Media', 'Alta'];

const PESO_PRIORIDAD = { Alta: 0, Media: 1, Baja: 2 };
export const pesoPrioridad = (p) => PESO_PRIORIDAD[p] ?? 3;

export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Fecha de hoy en formato YYYY-MM-DD según la hora local. */
export function hoyISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

/** Una tarea está vencida si su fecha ya pasó y no está completada. */
export function estaVencida(tarea) {
  return Boolean(tarea.fechaVencimiento) && tarea.estado !== 'Completada' && tarea.fechaVencimiento < hoyISO();
}

/** Convierte YYYY-MM-DD a un texto legible, p. ej. "15 nov 2026". */
export function formatearFecha(iso) {
  if (!iso) return '';
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
