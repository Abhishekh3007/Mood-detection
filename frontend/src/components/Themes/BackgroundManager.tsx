import React from 'react'

const moodStyles: Record<string, React.CSSProperties> = {
  happy: { background: 'linear-gradient(135deg,#ffefd5,#ffe4b5)' },
  sad: { background: 'linear-gradient(135deg,#cfe2ff,#9ec5fe)' },
  angry: { background: 'linear-gradient(135deg,#ffd6d6,#ffb3b3)' },
  neutral: { background: 'linear-gradient(135deg,#f0f0f0,#dcdcdc)' }
}

export default function BackgroundManager({ theme }: { theme: string }) {
  const style = moodStyles[theme] || moodStyles['neutral']
  return <div style={{ position: 'fixed', inset: 0, zIndex: -1, ...style }} aria-hidden />
}
