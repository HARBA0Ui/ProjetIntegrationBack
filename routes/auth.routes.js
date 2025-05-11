import { register, login } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // Add this

import express from 'express';
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (for testing)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user }); // Returns logged-in user's data
});

export default router;