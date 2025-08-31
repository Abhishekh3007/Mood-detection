// import LoginForm from './components/Auth/LoginForm'
import MoodInput from './components/MoodInput/MoodInput'
import MoodDisplay from './components/MoodInput/MoodDisplay'
import MusicPanel from './components/Music/MusicPanel'
import NewsPanel from './components/News/NewsPanel'
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard'
import './index.css'

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mood Bot - Frontend</h1>
  <MoodInput />
  <MoodDisplay mood={undefined} />
      <div style={{display:'flex',gap:20,marginTop:20}}>
        <div style={{flex:1}}>
          <MusicPanel mood={undefined} />
        </div>
        <div style={{flex:1}}>
          <NewsPanel mood={undefined} />
        </div>
      </div>
      <div style={{marginTop:30}}>
        <AnalyticsDashboard />
      </div>
    </div>
  )
}

