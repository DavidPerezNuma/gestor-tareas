import { useCallback, useMemo, useState } from 'react';
import { useTasks } from '../context/TasksContext';
import { ESTADOS, estaVencida, pesoPrioridad } from '../utils/constants';
import Filters from '../components/Filters';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';

const FILTROS_INICIALES = { busqueda: '', estado: '', prioridad: '' };

/** Ordena por fecha de vencimiento y, a igual fecha, por prioridad (Alta primero). */
const ordenar = (a, b) =>
  a.fechaVencimiento.localeCompare(b.fechaVencimiento) ||
  pesoPrioridad(a.prioridad) - pesoPrioridad(b.prioridad);

export default function Tasks() {
  const { tareas, crearTarea, editarTarea, eliminarTarea } = useTasks();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  // modal: null | { tipo: 'crear' } | { tipo: 'editar', tarea } | { tipo: 'eliminar', tarea }
  const [modal, setModal] = useState(null);

  const cerrarModal = useCallback(() => setModal(null), []);

  const tareasFiltradas = useMemo(() => {
    const texto = filtros.busqueda.trim().toLowerCase();
    return tareas
      .filter((t) => {
        const coincideTexto =
          !texto ||
          t.titulo.toLowerCase().includes(texto) ||
          t.descripcion.toLowerCase().includes(texto);
        const coincideEstado = !filtros.estado || t.estado === filtros.estado;
        const coincidePrioridad = !filtros.prioridad || t.prioridad === filtros.prioridad;
        return coincideTexto && coincideEstado && coincidePrioridad;
      })
      .sort(ordenar);
  }, [tareas, filtros]);

  const resumen = useMemo(
    () => ({
      total: tareas.length,
      completadas: tareas.filter((t) => t.estado === 'Completada').length,
      vencidas: tareas.filter(estaVencida).length,
    }),
    [tareas]
  );

  // Si se filtra por estado, solo se muestra esa columna.
  const columnasVisibles = filtros.estado ? [filtros.estado] : ESTADOS;
  const hayFiltros = Boolean(filtros.busqueda || filtros.estado || filtros.prioridad);

  const guardarNueva = (datos) => {
    crearTarea(datos);
    cerrarModal();
  };

  const guardarEdicion = (datos) => {
    editarTarea(modal.tarea.id, datos);
    cerrarModal();
  };

  const confirmarEliminar = () => {
    eliminarTarea(modal.tarea.id);
    cerrarModal();
  };

  return (
    <main className="tareas">
      <div className="tareas__cabecera">
        <div>
          <h1>Mis tareas</h1>
          <p className="tareas__resumen">
            {resumen.total} en total · {resumen.completadas} completadas
            {resumen.vencidas > 0 && (
              <span className="texto-vencida"> · {resumen.vencidas} vencidas</span>
            )}
          </p>
        </div>
        <button type="button" className="btn btn--primario" onClick={() => setModal({ tipo: 'crear' })}>
          + Nueva tarea
        </button>
      </div>

      <Filters
        filtros={filtros}
        onChange={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_INICIALES)}
      />

      {hayFiltros && (
        <p className="tareas__resultados">
          {tareasFiltradas.length === 1
            ? '1 tarea coincide con los filtros.'
            : `${tareasFiltradas.length} tareas coinciden con los filtros.`}
        </p>
      )}

      <div className={`tablero tablero--${columnasVisibles.length}`}>
        {columnasVisibles.map((estado) => (
          <TaskColumn
            key={estado}
            estado={estado}
            tareas={tareasFiltradas.filter((t) => t.estado === estado)}
            onEditar={(tarea) => setModal({ tipo: 'editar', tarea })}
            onEliminar={(tarea) => setModal({ tipo: 'eliminar', tarea })}
          />
        ))}
      </div>

      {modal?.tipo === 'crear' && (
        <Modal titulo="Nueva tarea" onClose={cerrarModal}>
          <TaskForm onSubmit={guardarNueva} onCancel={cerrarModal} />
        </Modal>
      )}

      {modal?.tipo === 'editar' && (
        <Modal titulo="Editar tarea" onClose={cerrarModal}>
          <TaskForm tarea={modal.tarea} onSubmit={guardarEdicion} onCancel={cerrarModal} />
        </Modal>
      )}

      {modal?.tipo === 'eliminar' && (
        <Modal titulo="Eliminar tarea" onClose={cerrarModal}>
          <p>
            ¿Seguro que deseas eliminar la tarea <strong>«{modal.tarea.titulo}»</strong>? Esta acción
            no se puede deshacer.
          </p>
          <div className="formulario__acciones">
            <button type="button" className="btn btn--secundario" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="button" className="btn btn--peligro" onClick={confirmarEliminar} autoFocus>
              Sí, eliminar
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
