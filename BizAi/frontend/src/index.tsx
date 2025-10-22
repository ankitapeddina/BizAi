import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/theme.css'; // <- add this import
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);