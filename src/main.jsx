import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RoutesApp } from './routes/RoutesApp.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  </React.StrictMode>,
)
