import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { obtenerTareas, guardarTareas, generarId } from '../utils/storage';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);

  // Cada vez que cambia el usuario se cargan solo sus tareas.
  useEffect(() => {
    setTareas(usuario ? obtenerTareas(usuario.id) : []);
  }, [usuario]);

  const persistir = (nuevas) => {
    setTareas(nuevas);
    if (usuario) guardarTareas(usuario.id, nuevas);
  };

  const crearTarea = (datos) => {
    const tarea = {
      id: generarId(),
      titulo: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      fechaVencimiento: datos.fechaVencimiento,
      prioridad: datos.prioridad,
      estado: 'Pendiente',
      creadaEn: new Date().toISOString(),
    };
    persistir([...tareas, tarea]);
  };

  const editarTarea = (id, cambios) => {
    persistir(
      tareas.map((t) =>
        t.id === id
          ? {
              ...t,
              ...cambios,
              titulo: (cambios.titulo ?? t.titulo).trim(),
              descripcion: (cambios.descripcion ?? t.descripcion).trim(),
              actualizadaEn: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const eliminarTarea = (id) => persistir(tareas.filter((t) => t.id !== id));

  const cambiarEstado = (id, estado) => editarTarea(id, { estado });

  const completarTarea = (id) => cambiarEstado(id, 'Completada');

  return (
    <TasksContext.Provider
      value={{ tareas, crearTarea, editarTarea, eliminarTarea, cambiarEstado, completarTarea }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
}
