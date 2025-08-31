const GENRES = ['pop', 'rock', 'electronic', 'classical', 'hip-hop', 'jazz'];

export default function GenreSelector({ value, onChange }:{ value?: string; onChange: (g?: string)=>void }){
  return (
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      {GENRES.map(g=> (
        <button key={g} onClick={()=>onChange(g)} style={{padding:8, borderRadius:8, background: value===g? '#444':'#eee', color: value===g? '#fff':'#000'}}>
          {g}
        </button>
      ))}
      <button onClick={()=>onChange(undefined)} style={{padding:8}}>Clear</button>
    </div>
  );
}
