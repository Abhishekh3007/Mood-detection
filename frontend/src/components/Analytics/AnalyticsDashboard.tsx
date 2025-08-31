import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { createClient } from '@supabase/supabase-js';

// ...existing code...

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AnalyticsDashboard(){
  const [distribution, setDistribution] = useState<Record<string,number>>({});
  const [series, setSeries] = useState<{date:string;count:number}[]>([]);

  async function fetchData(){
    const res = await fetch('/api/analytics/mood');
    if(!res.ok) throw new Error('Failed to fetch analytics');
    const data = await res.json();
    setDistribution(data.distribution || {});
    setSeries(data.series || []);
  }

  useEffect(()=>{
    fetchData().catch(console.error);

    const channel = supabase
      .channel('public:mood_entries')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'mood_entries' }, () => {
          // refresh analytics on any change
          fetchData().catch(console.error);
        })
      .subscribe();

    return ()=>{ supabase.removeChannel(channel); };
  },[]);

  const pieData = {
    labels: Object.keys(distribution),
    datasets: [{ data: Object.values(distribution), backgroundColor: ['#4ade80','#60a5fa','#f97316','#fb7185','#a78bfa','#facc15'] }]
  };

  const lineData = {
    labels: series.map(s=>s.date),
    datasets: [{ label: 'mood entries', data: series.map(s=>s.count), fill:false, borderColor:'#60a5fa' }]
  };

  return (
    <div>
      <h3>Analytics</h3>
      <div style={{display:'flex',gap:20}}>
        <div style={{width:300}}>
          <Pie data={pieData} />
        </div>
        <div style={{flex:1}}>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}
