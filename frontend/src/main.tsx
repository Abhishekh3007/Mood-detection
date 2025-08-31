import 'regenerator-runtime/runtime';
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import BackgroundManager from './components/Themes/BackgroundManager'

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BackgroundManager theme={(localStorage.getItem('mood_theme') as any) || 'neutral'} />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
