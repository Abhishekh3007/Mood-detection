import axios from 'axios';

const NEWS_API_BASE = 'https://newsapi.org/v2';

export async function fetchNews(mood?: string, category?: string) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error('NEWS_API_KEY not set');

  const params: any = { apiKey, pageSize: 10 };
  if (category) params.category = category;
  if (mood) {
    // simple mood => keyword mapping
    const moodKeywords: Record<string, string> = {
      happy: 'positive OR inspiring',
      sad: 'uplifting OR support',
      neutral: 'technology OR science',
      surprise: 'innovation OR breakthrough',
      angry: 'analysis OR opinion'
    };
    params.q = moodKeywords[mood] || mood;
  }

  const resp = await axios.get(`${NEWS_API_BASE}/top-headlines`, { params });
  return { articles: resp.data.articles || [] };
}

export default { fetchNews };
