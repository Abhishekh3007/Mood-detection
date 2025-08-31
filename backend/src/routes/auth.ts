import express from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase';

const router = express.Router();

// Register - create user via Supabase Auth
router.post('/register', async (req, res) => {
  const { email, password, username, fullName } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'email and password required' });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { username, fullName }
  });

  if (error) return res.status(500).json({ success: false, error: error.message });

  const userId = (data as any)?.user?.id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return res.json({ success: true, user: { id: userId, email: (data as any)?.user?.email || email }, access_token: token });
});

// Login - verify via Supabase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'email and password required' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ success: false, error: error.message });

  // create JWT for our app sessions
  const userId = (data as any)?.user?.id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return res.json({ success: true, user: (data as any)?.user, access_token: token });
});

export default router;
