import { Router } from 'express';
import { fetchNews } from '../services/newsService';

const router = Router();

// GET /api/news?mood=&category=
router.get('/', async (req, res) => {
  try {
    const mood = req.query.mood as string | undefined;
    const category = req.query.category as string | undefined;
    const data = await fetchNews(mood, category);
    res.json({ ok: true, ...data });
  } catch (err: any) {
    console.error('news feed error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
