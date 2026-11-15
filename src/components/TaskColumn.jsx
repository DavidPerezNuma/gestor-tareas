import TaskCard from './TaskCard';

const CLASE_ESTADO = {
  Pendiente: 'pendiente',
  'En progreso': 'progreso',
  Completada: 'completada',
};

export default function TaskColumn({ estado, tareas, onEditar, onEliminar }) {
  return (
    <section className={`columna columna--${CLASE_ESTADO[estado]}`}>
      <header className="columna__cabecera">
        <h2>{estado}</h2>
        <span className="columna__contador">{tareas.length}</span>
      </header>
      <div className="columna__lista">
        {tareas.length === 0 ? (
          <p className="columna__vacia">No hay tareas aquí.</p>
        ) : (
          tareas.map((t) => (
            <TaskCard key={t.id} tarea={t} onEditar={onEditar} onEliminar={onEliminar} />
          ))
        )}
      </div>
    </section>
  );
}
