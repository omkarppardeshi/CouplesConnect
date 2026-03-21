import express from 'express';
import { POSITIONS, QUESTIONS } from '../data/spicyContent.js';

const router = express.Router();

// Get random position card
router.get('/position', (req, res) => {
  const random = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  res.json(random);
});

// Get random question by category
router.get('/question/:category', (req, res) => {
  const { category } = req.params;
  const questions = QUESTIONS[category] || QUESTIONS.dirty;
  const random = questions[Math.floor(Math.random() * questions.length)];
  res.json({ question: random, category });
});

// Get all categories
router.get('/categories', (req, res) => {
  res.json(Object.keys(QUESTIONS));
});

export default router;
