import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { createClient } from '@supabase/supabase-js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// ...existing code...

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AnalyticsDashboard(){
  const [distribution, setDistribution] = useState<Record<string,number>>({
    'Happy': 0,
    'Sad': 0,
    'Neutral': 0
  });
  const [series, setSeries] = useState<{date:string;count:number}[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(){
    try {
      const res = await fetch('/api/analytics/mood');
      if(!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setDistribution(data.distribution || {});
      setSeries(data.series || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    }
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
    datasets: [{ 
      data: Object.values(distribution), 
      backgroundColor: ['#4ade80','#60a5fa','#f97316','#fb7185','#a78bfa','#facc15'],
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Mood Distribution'
      }
    }
  };

  const lineData = {
    labels: series.map(s=>s.date),
    datasets: [{ 
      label: 'Mood Entries', 
      data: series.map(s=>s.count), 
      fill: false, 
      borderColor: '#60a5fa',
      tension: 0.1
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Mood Entries Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <h3>Analytics</h3>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Analytics</h3>
      <div style={{display:'flex',gap:20}}>
        <div style={{width:300}}>
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div style={{flex:1}}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}
