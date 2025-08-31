import axios from 'axios';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

let spotifyAccessToken: string | null = null;
let spotifyTokenExpiry = 0;

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (spotifyAccessToken && now < spotifyTokenExpiry) return spotifyAccessToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Spotify client credentials not set');

  const resp = await axios.post(
    SPOTIFY_TOKEN_URL,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }
    }
  );

  spotifyAccessToken = resp.data.access_token;
  spotifyTokenExpiry = Date.now() + (resp.data.expires_in - 60) * 1000;
  return spotifyAccessToken;
}

export async function getMusicRecommendations(mood?: string, genre?: string) {
  const token = await getSpotifyAccessToken();
  // Map mood to seed genres or artists
  const moodMap: Record<string, string[]> = {
    happy: ['pop', 'dance'],
    sad: ['acoustic', 'piano'],
    angry: ['rock', 'metal'],
    neutral: ['indie', 'alternative'],
    surprise: ['electronic'],
    disgust: ['ambient'],
    fear: ['classical']
  };

  const seeds = genre ? [genre] : (mood && moodMap[mood] ? moodMap[mood] : ['pop']);

  // Use Spotify recommendations endpoint
  const params = new URLSearchParams();
  if (seeds.length) params.set('seed_genres', seeds.slice(0, 5).join(','));
  params.set('limit', '10');

  const url = `${SPOTIFY_API_BASE}/recommendations?${params.toString()}`;
  const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

  const tracks = resp.data.tracks.map((t: any) => ({
    title: t.name,
    artist: t.artists.map((a: any) => a.name).join(', '),
    spotifyUrl: t.external_urls.spotify
  }));

  return { recommendations: tracks, genres: seeds };
}

export default { getMusicRecommendations };
