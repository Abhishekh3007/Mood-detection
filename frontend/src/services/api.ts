export async function getMusicRecommendations(mood?: string, genre?: string) {
  const qs = new URLSearchParams();
  if (mood) qs.set('mood', mood);
  if (genre) qs.set('genre', genre);
  const res = await fetch(`/api/recommendations/music?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch music recommendations');
  return res.json();
}

export async function getNewsFeed(mood?: string, category?: string) {
  const qs = new URLSearchParams();
  if (mood) qs.set('mood', mood);
  if (category) qs.set('category', category);
  const res = await fetch(`/api/news?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}
