import { Router } from 'express';
import { getMusicRecommendations } from '../services/recommendationService';

const router = Router();

// GET /api/recommendations/music?mood=&genre=
router.get('/music', async (req, res) => {
  try {
    const mood = req.query.mood as string | undefined;
    const genre = req.query.genre as string | undefined;
    const tracks = await getMusicRecommendations(mood, genre);
    res.json({ ok: true, tracks });
  } catch (err: any) {
    console.error('recommendations/music error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
