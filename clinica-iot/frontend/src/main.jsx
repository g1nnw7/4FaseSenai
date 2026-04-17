import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1a0e',
              color: '#e5e7eb',
              border: '1px solid #153319',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#030805' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#030805' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);