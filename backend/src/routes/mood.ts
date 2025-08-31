import express from 'express';
import moodService from '../services/moodAnalysisService';
import supabase from '../config/supabase';

const router = express.Router();

// Analyze mood endpoint
router.post('/analyze', async (req, res) => {
  const { message, inputType = 'text', sessionId } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'message is required' });

  // For now, require an Authorization header with Bearer <token> containing userId
  const auth = req.headers.authorization;
  let userId: string | null = null;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.slice(7);
      const decoded: any = require('jsonwebtoken').verify(token, process.env.JWT_SECRET!);
      userId = decoded.userId;
    } catch (e) {
      // ignore
    }
  }

  const analysis = await moodService.analyzeEmotion(message);
  const aiResponse = await moodService.generateResponse(analysis.emotion, message);

  const combined = {
    emotion: analysis.emotion,
    confidence: analysis.confidence,
    reasoning: analysis.reasoning,
    aiResponse: aiResponse.aiResponse || aiResponse,
    motivationalQuote: aiResponse.motivationalQuote || aiResponse.motivational_quote || '',
    backgroundTheme: aiResponse.backgroundTheme || aiResponse.background_theme || 'neutral'
  };

  if (userId) {
    try {
      const entry = await moodService.saveMoodEntry(userId, { message, inputType, sessionId, ...combined });
      return res.json({ success: true, analysis: { ...combined, entryId: entry.id } });
    } catch (err: any) {
      // continue and return analysis without saving
    }
  }

  return res.json({ success: true, analysis: combined });
});

export default router;
