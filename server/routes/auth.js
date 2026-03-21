import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();

// Register a new device with WebAuthn
router.post('/register', async (req, res) => {
  try {
    const { credentialID, credentialPublicKey, deviceName } = req.body;

    const existingUser = await User.findOne({ credentialID });
    if (existingUser) {
      // Update deviceName if registering with a new name
      if (deviceName && deviceName !== 'My Device') {
        existingUser.deviceName = deviceName;
        await existingUser.save();
      }
      return res.status(200).json({ userId: existingUser._id, deviceName: existingUser.deviceName, isExisting: true });
    }

    const user = new User({
      credentialID,
      credentialPublicKey,
      deviceName: deviceName || 'My Device'
    });

    await user.save();
    res.status(201).json({ userId: user._id, isExisting: false });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Authenticate (verify WebAuthn assertion)
router.post('/authenticate', async (req, res) => {
  try {
    const { credentialID } = req.body;

    const user = await User.findOne({ credentialID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update counter for future authentication
    user.counter += 1;
    await user.save();

    res.status(200).json({ userId: user._id, deviceName: user.deviceName, authenticated: true });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user info
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ userId: user._id, deviceName: user.deviceName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
