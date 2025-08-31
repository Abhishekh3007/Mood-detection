import React from 'react'
import LoginForm from './components/Auth/LoginForm'
import './index.css'

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mood Bot - Frontend</h1>
      <LoginForm />
    </div>
  )
}

