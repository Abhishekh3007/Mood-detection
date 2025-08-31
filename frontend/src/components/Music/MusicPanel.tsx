import { useEffect, useState } from 'react';
import { getMusicRecommendations } from '../../services/api';
import GenreSelector from './GenreSelector';

type Track = { title: string; artist: string; spotifyUrl: string };

export default function MusicPanel({ mood }:{ mood?: string }){
  const [genre, setGenre] = useState<string|undefined>(undefined);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let active = true;
    setLoading(true);
    getMusicRecommendations(mood, genre).then((data:{ tracks?: Track[] })=>{
      if(!active) return;
      setTracks(data.tracks || []);
    }).catch(err=> console.error(err)).finally(()=> setLoading(false));
    return ()=>{ active = false; };
  },[mood, genre]);

  return (
    <div>
      <h3>Music Recommendations</h3>
      <GenreSelector value={genre} onChange={setGenre} />
      {loading && <div>Loading...</div>}
      <ul>
        {tracks.map((t,i)=>(
          <li key={i} style={{marginBottom:8}}>
            <a href={t.spotifyUrl} target="_blank" rel="noreferrer">{t.title}</a> — {t.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
