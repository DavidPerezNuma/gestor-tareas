import { ESTADOS, estaVencida, formatearFecha } from '../utils/constants';
import { useTasks } from '../context/TasksContext';

export default function TaskCard({ tarea, onEditar, onEliminar }) {
  const { cambiarEstado, completarTarea } = useTasks();
  const vencida = estaVencida(tarea);
  const completada = tarea.estado === 'Completada';
  const prioridad = tarea.prioridad.toLowerCase();

  const clases = ['tarjeta', `tarjeta--${prioridad}`];
  if (vencida) clases.push('tarjeta--vencida');
  if (completada) clases.push('tarjeta--completada');

  return (
    <article className={clases.join(' ')}>
      <div className="tarjeta__cabecera">
        <span className={`insignia insignia--${prioridad}`}>Prioridad {tarea.prioridad}</span>
        {vencida && <span className="insignia insignia--vencida">Vencida</span>}
      </div>

      <h3 className="tarjeta__titulo">{tarea.titulo}</h3>
      {tarea.descripcion && <p className="tarjeta__descripcion">{tarea.descripcion}</p>}

      <p className={vencida ? 'tarjeta__fecha tarjeta__fecha--vencida' : 'tarjeta__fecha'}>
        Vence: <strong>{formatearFecha(tarea.fechaVencimiento)}</strong>
      </p>

      <div className="tarjeta__estado">
        <label htmlFor={`estado-${tarea.id}`}>Estado</label>
        <select
          id={`estado-${tarea.id}`}
          value={tarea.estado}
          onChange={(e) => cambiarEstado(tarea.id, e.target.value)}
        >
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      <div className="tarjeta__acciones">
        {!completada && (
          <button
            type="button"
            className="btn btn--exito btn--sm"
            onClick={() => completarTarea(tarea.id)}
          >
            ✓ Completar
          </button>
        )}
        <button type="button" className="btn btn--secundario btn--sm" onClick={() => onEditar(tarea)}>
          Editar
        </button>
        <button type="button" className="btn btn--peligro btn--sm" onClick={() => onEliminar(tarea)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
