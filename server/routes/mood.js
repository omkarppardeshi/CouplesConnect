import express from 'express';
import Mood from '../models/Mood.js';

const router = express.Router();

// Submit mood check-in
router.post('/', async (req, res) => {
  try {
    const { coupleId, userId, mood, note } = req.body;

    const moodEntry = new Mood({
      coupleId,
      userId,
      mood,
      note
    });

    await moodEntry.save();
    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Mood submission error:', error);
    res.status(500).json({ error: 'Failed to submit mood' });
  }
});

// Get mood history for couple
router.get('/:coupleId', async (req, res) => {
  try {
    const { coupleId } = req.params;
    const { days = 7 } = req.query;

    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const moods = await Mood.find({
      coupleId,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 });

    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Get latest mood for each user in couple
router.get('/:coupleId/latest', async (req, res) => {
  try {
    const { coupleId } = req.params;

    const latestMoods = await Mood.aggregate([
      { $match: { coupleId: require('mongoose').Types.ObjectId(coupleId) } },
      { $sort: { timestamp: -1 } },
      { $group: {
        _id: '$userId',
        mood: { $first: '$mood' },
        note: { $first: '$note' },
        timestamp: { $first: '$timestamp' }
      }}
    ]);

    res.status(200).json(latestMoods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest moods' });
  }
});

export default router;
