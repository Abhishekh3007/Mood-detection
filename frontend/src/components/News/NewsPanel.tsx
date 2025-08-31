import { useEffect, useState } from 'react';
import { getNewsFeed } from '../../services/api';

type Article = { title: string; url: string; source?: { name?: string } };

export default function NewsPanel({ mood }:{ mood?: string }){
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let active = true;
    setLoading(true);
    getNewsFeed(mood).then((data:{ articles?: Article[] })=>{
      if(!active) return;
      setArticles(data.articles || []);
    }).catch(err=> console.error(err)).finally(()=> setLoading(false));
    return ()=>{ active = false; };
  },[mood]);

  return (
    <div>
      <h3>News for you</h3>
      {loading && <div>Loading...</div>}
      <ul>
        {articles.map((a,i)=>(
          <li key={i} style={{marginBottom:10}}>
            <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a>
            <div style={{fontSize:12,color:'#666'}}>{a.source?.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
