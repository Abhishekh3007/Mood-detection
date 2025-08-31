import MoodInput from './components/MoodInput/MoodInput';
import MusicPanel from './components/Music/MusicPanel';
import NewsPanel from './components/News/NewsPanel';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="app-header">
          <h1 className="text-2xl font-bold mb-4">Mood Detection & Analysis</h1>
        </header>
        
        <main className="app-main">
          <section className="mood-section">
            <MoodInput />
          </section>
          
          <section className="recommendations-section">
            <div className="flex gap-4">
              <div className="flex-1">
                <MusicPanel mood={undefined} />
              </div>
              <div className="flex-1">
                <NewsPanel mood={undefined} />
              </div>
            </div>
          </section>
          
          <section className="analytics-section">
            <AnalyticsDashboard />
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
        
     

}

