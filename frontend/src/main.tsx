import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppContent } from './App'
import { AuthProvider } from './context/AuthContext'
import { CollegeDataProvider } from './context/CollegeDataContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CollegeDataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CollegeDataProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
