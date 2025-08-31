import React, { useEffect, useState, useContext } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ThemeContext } from '../../contexts/ThemeContext';
import MoodDisplay from './MoodDisplay';

type Analysis = {
  emotion?: string;
  confidence?: number;
  aiResponse?: string;
  motivationalQuote?: string;
  backgroundTheme?: string;
  entryId?: string;
};

const MoodInput: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'speech'>('text');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const { setTheme } = useContext(ThemeContext);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (mode === 'speech') {
      setText(transcript);
    }
  }, [transcript, mode]);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) return alert('Speech recognition not supported in this browser');
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmit = async (input: string) => {
    if (!input || input.trim().length === 0) return;
    setIsSubmitting(true);
    setResult(null);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/mood/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: input, inputType: mode })
      });

      const data = await res.json();
      if (data && data.analysis) {
        setResult(data.analysis);
        if (data.analysis.emotion) setTheme(data.analysis.emotion as any);
      } else if (data && data.success && data.analysis) {
        setResult(data.analysis);
      } else {
        setResult({ aiResponse: JSON.stringify(data) });
      }
    } catch (err: any) {
      setResult({ aiResponse: `Error: ${err?.message || String(err)}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <button onClick={() => setMode('text')} className={mode === 'text' ? 'font-bold' : ''}>Text</button>
        <button onClick={() => setMode('speech')} className={mode === 'speech' ? 'font-bold' : ''}>Speech</button>
      </div>

      {mode === 'speech' ? (
        <div className="space-y-2">
          <div>Listening: {listening ? 'yes' : 'no'}</div>
          <div className="flex gap-2">
            <button onClick={startListening} className="px-3 py-1 bg-green-600 text-white rounded">Start</button>
            <button onClick={stopListening} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
            <button onClick={() => handleSubmit(transcript)} disabled={isSubmitting} className="px-3 py-1 bg-blue-600 text-white rounded">Analyze</button>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="border p-2 w-full" />
        </div>
      ) : (
        <div className="space-y-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="border p-2 w-full" />
          <div className="flex gap-2">
            <button onClick={() => handleSubmit(text)} disabled={isSubmitting} className="px-3 py-1 bg-blue-600 text-white rounded">Analyze</button>
            <button onClick={() => { setText(''); setResult(null); }} className="px-3 py-1 bg-gray-300 rounded">Clear</button>
          </div>
        </div>
      )}

      {isSubmitting && <div>Analyzing...</div>}

      {result && (
        <MoodDisplay mood={result.emotion} confidence={result.confidence} aiResponse={result.aiResponse} motivationalQuote={result.motivationalQuote} />
      )}
    </div>
  );
};

export default MoodInput;
