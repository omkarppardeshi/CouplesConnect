import express from 'express';
import { generateQuote } from '../services/quoteService.js';

const router = express.Router();

// Generate an AI quote
router.post('/generate', async (req, res) => {
  try {
    const { category = 'calm' } = req.body;
    const quote = await generateQuote(category);
    res.status(200).json({ quote });
  } catch (error) {
    console.error('Quote generation error:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

export default router;
