import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Couple from '../models/Couple.js';
import User from '../models/User.js';

const router = express.Router();

// Generate a unique 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a new couple pairing
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already in a couple
    const existingCouple = await Couple.findOne({ users: userId });
    if (existingCouple) {
      return res.status(400).json({ error: 'User is already in a couple', coupleId: existingCouple._id });
    }

    // Generate unique code
    let code;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
    } while (await Couple.findOne({ code }) && attempts < 10);

    const couple = new Couple({
      code,
      users: [userId]
    });

    await couple.save();
    res.status(201).json({ coupleId: couple._id, code, isNew: true });
  } catch (error) {
    console.error('Create couple error:', error);
    res.status(500).json({ error: 'Failed to create couple' });
  }
});

// Join an existing couple with code
router.post('/join', async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already in a couple
    const existingCouple = await Couple.findOne({ users: userId });
    if (existingCouple) {
      return res.status(400).json({ error: 'User is already in a couple', coupleId: existingCouple._id });
    }

    // Find couple with code
    const couple = await Couple.findOne({ code });
    if (!couple) {
      return res.status(404).json({ error: 'Invalid code' });
    }

    if (couple.users.length >= 2) {
      return res.status(400).json({ error: 'Couple is full' });
    }

    // Add user to couple
    couple.users.push(userId);
    await couple.save();

    res.status(200).json({ coupleId: couple._id, code: couple.code, isNew: false });
  } catch (error) {
    console.error('Join couple error:', error);
    res.status(500).json({ error: 'Failed to join couple' });
  }
});

// Get couple info
router.get('/:coupleId', async (req, res) => {
  try {
    const couple = await Couple.findById(req.params.coupleId).populate('users', 'deviceName');
    if (!couple) {
      return res.status(404).json({ error: 'Couple not found' });
    }
    res.status(200).json({
      coupleId: couple._id,
      code: couple.code,
      users: couple.users,
      settings: couple.settings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch couple' });
  }
});

// Get couple by user ID
router.get('/by-user/:userId', async (req, res) => {
  try {
    const couple = await Couple.findOne({ users: req.params.userId }).populate('users', 'deviceName');
    if (!couple) {
      return res.status(404).json({ error: 'No couple found for user' });
    }
    res.status(200).json({
      _id: couple._id,
      code: couple.code,
      users: couple.users,
      settings: couple.settings,
      fightMode: couple.fightMode
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch couple' });
  }
});

// Update couple settings
router.put('/:coupleId/settings', async (req, res) => {
  try {
    const { fightModeDuration, quietHours } = req.body;
    const couple = await Couple.findById(req.params.coupleId);
    if (!couple) {
      return res.status(404).json({ error: 'Couple not found' });
    }

    if (fightModeDuration !== undefined) {
      couple.settings.fightModeDuration = fightModeDuration;
    }
    if (quietHours !== undefined) {
      couple.settings.quietHours = { ...couple.settings.quietHours, ...quietHours };
    }

    await couple.save();
    res.status(200).json({ settings: couple.settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
