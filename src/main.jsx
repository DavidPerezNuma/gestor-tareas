import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* basename = "/gestor-tareas/" en GitHub Pages y "/" en desarrollo */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <TasksProvider>
          <App />
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
