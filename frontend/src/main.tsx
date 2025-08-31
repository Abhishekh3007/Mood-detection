import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import BackgroundManager from './components/Themes/BackgroundManager'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BackgroundManager theme={localStorage.getItem('mood_theme') || 'neutral'} />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
import { StrictMode } from 'react'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
