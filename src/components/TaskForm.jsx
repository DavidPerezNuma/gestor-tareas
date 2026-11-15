import { useState } from 'react';
import { PRIORIDADES, hoyISO } from '../utils/constants';

const VACIO = { titulo: '', descripcion: '', fechaVencimiento: '', prioridad: 'Media' };

function validar(valores, esNueva) {
  const errores = {};
  const titulo = valores.titulo.trim();
  if (!titulo) errores.titulo = 'El título es obligatorio.';
  else if (titulo.length < 3) errores.titulo = 'El título debe tener al menos 3 caracteres.';
  else if (titulo.length > 100) errores.titulo = 'El título no puede superar 100 caracteres.';

  if (valores.descripcion.trim().length > 500) {
    errores.descripcion = 'La descripción no puede superar 500 caracteres.';
  }

  if (!valores.fechaVencimiento) {
    errores.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
  } else if (esNueva && valores.fechaVencimiento < hoyISO()) {
    errores.fechaVencimiento = 'La fecha de vencimiento no puede ser anterior a hoy.';
  }

  if (!PRIORIDADES.includes(valores.prioridad)) errores.prioridad = 'Selecciona una prioridad.';
  return errores;
}

/**
 * Formulario para crear o editar una tarea.
 * Si recibe la prop `tarea`, funciona en modo edición.
 */
export default function TaskForm({ tarea, onSubmit, onCancel }) {
  const esNueva = !tarea;
  const [valores, setValores] = useState(() =>
    tarea
      ? {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          fechaVencimiento: tarea.fechaVencimiento,
          prioridad: tarea.prioridad,
        }
      : VACIO
  );
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: undefined }));
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validar(valores, esNueva);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) onSubmit(valores);
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="titulo">Título *</label>
        <input
          id="titulo"
          name="titulo"
          value={valores.titulo}
          onChange={cambiar}
          placeholder="Ej.: Entregar taller de software"
          maxLength={120}
          className={errores.titulo ? 'invalido' : ''}
          autoFocus
        />
        {errores.titulo && <p className="campo__error">{errores.titulo}</p>}
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={valores.descripcion}
          onChange={cambiar}
          placeholder="Detalles de la tarea (opcional)"
          className={errores.descripcion ? 'invalido' : ''}
        />
        <p className="campo__ayuda">{valores.descripcion.trim().length}/500</p>
        {errores.descripcion && <p className="campo__error">{errores.descripcion}</p>}
      </div>

      <div className="formulario__fila">
        <div className="campo">
          <label htmlFor="fechaVencimiento">Fecha de vencimiento *</label>
          <input
            id="fechaVencimiento"
            type="date"
            name="fechaVencimiento"
            value={valores.fechaVencimiento}
            min={esNueva ? hoyISO() : undefined}
            onChange={cambiar}
            className={errores.fechaVencimiento ? 'invalido' : ''}
          />
          {errores.fechaVencimiento && <p className="campo__error">{errores.fechaVencimiento}</p>}
        </div>

        <div className="campo">
          <label htmlFor="prioridad">Prioridad *</label>
          <select
            id="prioridad"
            name="prioridad"
            value={valores.prioridad}
            onChange={cambiar}
            className={errores.prioridad ? 'invalido' : ''}
          >
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errores.prioridad && <p className="campo__error">{errores.prioridad}</p>}
        </div>
      </div>

      <div className="formulario__acciones">
        <button type="button" className="btn btn--secundario" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primario">
          {esNueva ? 'Crear tarea' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
