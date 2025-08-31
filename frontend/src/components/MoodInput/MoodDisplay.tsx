import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

type Props = {
  mood: string | undefined
  confidence?: number | undefined
  aiResponse?: string | undefined
  motivationalQuote?: string | undefined
}

export default function MoodDisplay({ mood, confidence, aiResponse, motivationalQuote }: Props) {
  const { setTheme } = useContext(ThemeContext)

  if (mood) setTheme(mood as any)

  return (
    <div className="mt-4 p-4 border rounded">
      <div><strong>Mood:</strong> {mood}</div>
      <div><strong>Confidence:</strong> {confidence}</div>
      <div><strong>AI Response:</strong> {aiResponse}</div>
      <div><strong>Quote:</strong> {motivationalQuote}</div>
    </div>
  )
}
