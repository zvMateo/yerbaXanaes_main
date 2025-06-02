// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Contiene las directivas de Tailwind
import 'react-toastify/dist/ReactToastify.css' // Estilos de react-toastify
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)