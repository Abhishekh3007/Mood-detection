import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import moodRoutes from './routes/mood';
import recommendationsRoutes from './routes/recommendations';
import newsRoutes from './routes/news';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
	app.use('/api/recommendations', recommendationsRoutes);
	app.use('/api/news', newsRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

export default app;
