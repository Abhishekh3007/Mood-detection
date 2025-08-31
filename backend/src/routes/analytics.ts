import { Router } from 'express';
import { getMoodAnalytics } from '../services/analyticsService';

const router = Router();

router.get('/mood', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = await getMoodAnalytics(days);
    res.json({ ok: true, ...data });
  } catch (err: any) {
    console.error('analytics/mood error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
