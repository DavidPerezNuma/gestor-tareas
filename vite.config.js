import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En producción la app se publica en https://<usuario>.github.io/gestor-tareas/
// por eso la ruta base es "/gestor-tareas/". En desarrollo se usa "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/gestor-tareas/' : '/',
  plugins: [react()],
}));
