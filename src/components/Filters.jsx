import { ESTADOS, PRIORIDADES } from '../utils/constants';

/** Búsqueda por texto + filtros por estado y prioridad (se pueden combinar). */
export default function Filters({ filtros, onChange, onLimpiar }) {
  const cambiar = (e) => onChange({ ...filtros, [e.target.name]: e.target.value });
  const hayFiltros = Boolean(filtros.busqueda || filtros.estado || filtros.prioridad);

  return (
    <div className="filtros">
      <div className="campo filtros__busqueda">
        <label htmlFor="busqueda">Buscar</label>
        <input
          id="busqueda"
          name="busqueda"
          type="search"
          placeholder="Buscar por título o descripción..."
          value={filtros.busqueda}
          onChange={cambiar}
        />
      </div>
      <div className="campo">
        <label htmlFor="filtro-estado">Estado</label>
        <select id="filtro-estado" name="estado" value={filtros.estado} onChange={cambiar}>
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor="filtro-prioridad">Prioridad</label>
        <select id="filtro-prioridad" name="prioridad" value={filtros.prioridad} onChange={cambiar}>
          <option value="">Todas</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn--secundario filtros__limpiar"
        onClick={onLimpiar}
        disabled={!hayFiltros}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
