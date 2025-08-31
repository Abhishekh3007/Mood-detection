import { supabase } from '../config/supabase';

type MoodEntry = { mood: string; created_at: string };

export async function getMoodAnalytics(days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood,created_at')
    .gte('created_at', cutoff.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  const distribution: Record<string, number> = {};
  const timeseries: Record<string, number> = {};

  (data || []).forEach((row) => {
    const m = row.mood || 'unknown';
    distribution[m] = (distribution[m] || 0) + 1;
    const d = new Date(row.created_at).toISOString().slice(0, 10);
    timeseries[d] = (timeseries[d] || 0) + 1;
  });

  // convert timeseries to sorted array of { date, count }
  const series = Object.keys(timeseries)
    .sort()
    .map((date) => ({ date, count: timeseries[date] }));

  return { distribution, series };
}

export default { getMoodAnalytics };
