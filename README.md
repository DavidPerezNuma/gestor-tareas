# Gestor de Tareas

Aplicación web de gestión de tareas desarrollada con **React + Vite** para la asignatura *Herramientas de Software*. No tiene backend: todos los datos (usuarios, sesión y tareas) se guardan en el `localStorage` del navegador.

## Funcionalidades

- **Registro e inicio de sesión** con nombre, correo y contraseña.
  - La contraseña se guarda como hash **SHA-256** (Web Crypto API, `crypto.subtle`).
  - Validación de campos vacíos, formato de correo, longitud de contraseña y correo duplicado.
  - Sesión persistente y botón de **cerrar sesión**.
  - Cada usuario ve **solo sus propias tareas**.
- **Crear tareas** con título, descripción, fecha de vencimiento y prioridad (Baja, Media, Alta). Toda tarea nueva inicia en estado **Pendiente**.
- **Tablero de 3 columnas** por estado: *Pendiente*, *En progreso* y *Completada*.
  - La prioridad se distingue por color (verde, ámbar, rojo).
  - Las tareas **vencidas** (fecha pasada y no completadas) se resaltan en rojo.
- **Editar** tareas en una ventana modal y **eliminar** con confirmación.
- **Cambiar el estado** directamente desde la tarjeta y botón **✓ Completar**.
- **Búsqueda** por título o descripción y **filtros** por estado y prioridad, combinables entre sí.
- Diseño **responsive** (escritorio, tableta y móvil).

## Tecnologías

| Herramienta | Uso |
|---|---|
| React 18 | Componentes funcionales y hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`) |
| Vite 5 | Servidor de desarrollo y empaquetado |
| react-router-dom 6 | Rutas `/login`, `/registro` y `/tareas` (protegida) |
| localStorage | Persistencia de datos |
| Web Crypto API | Hash SHA-256 de contraseñas |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`).

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo (http://localhost:5173)
npm run dev

# 3. Generar la versión de producción en /dist
npm run build

# 4. Previsualizar la versión de producción
npm run preview
```

> **Nota:** `crypto.subtle` solo funciona en contextos seguros (`https://` o `localhost`). Si se abre la app desde otra IP de la red local por `http`, el registro y el login no funcionarán.

## Estructura de carpetas

```
gestor-tareas/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
├── docs/
│   └── capturas/            # Capturas de pantalla para este README
└── src/
    ├── main.jsx             # Punto de entrada: Router + proveedores de contexto
    ├── App.jsx              # Definición de rutas
    ├── index.css            # Estilos globales y responsive
    ├── components/
    │   ├── Navbar.jsx           # Barra superior con usuario y cerrar sesión
    │   ├── ProtectedRoute.jsx   # Redirige a /login si no hay sesión
    │   ├── TaskCard.jsx         # Tarjeta de tarea (prioridad, vencimiento, acciones)
    │   ├── TaskColumn.jsx       # Columna del tablero por estado
    │   ├── TaskForm.jsx         # Formulario de creación/edición con validaciones
    │   ├── Filters.jsx          # Búsqueda y filtros
    │   └── Modal.jsx            # Ventana modal reutilizable
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Tasks.jsx            # Tablero principal
    ├── context/
    │   ├── AuthContext.jsx      # Registro, login, logout y sesión
    │   └── TasksContext.jsx     # CRUD de tareas del usuario actual
    └── utils/
        ├── storage.js           # Lectura/escritura en localStorage
        ├── hash.js              # SHA-256 con crypto.subtle
        └── constants.js         # Estados, prioridades y utilidades de fechas
```

### Modelo de datos en localStorage

| Clave | Contenido |
|---|---|
| `gt_usuarios` | Arreglo de usuarios `{ id, nombre, correo, passwordHash, creadoEn }` |
| `gt_sesion` | Usuario con sesión activa `{ id, nombre, correo }` |
| `gt_tareas_<idUsuario>` | Tareas del usuario `{ id, titulo, descripcion, fechaVencimiento, prioridad, estado, creadaEn }` |

## Capturas de pantalla

### Inicio de sesión
![Inicio de sesión](docs/capturas/login.png)

### Registro
![Registro](docs/capturas/registro.png)

### Tablero de tareas
![Tablero de tareas](docs/capturas/tareas.png)

### Edición de tarea
![Edición de tarea](docs/capturas/editar.png)

### Vista móvil
![Vista móvil](docs/capturas/movil.png)

> Para actualizar las capturas: ejecuta `npm run dev`, toma las imágenes y guárdalas en `docs/capturas/` con los nombres indicados.
