import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get messages for a couple
router.get('/:coupleId', async (req, res) => {
  try {
    const { coupleId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { coupleId, type: { $ne: 'hug' } };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('senderId', 'deviceName');

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { coupleId, senderId, content, type = 'text', metadata = {} } = req.body;

    const message = new Message({
      coupleId,
      senderId,
      content,
      type,
      metadata
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Mark messages as read
router.put('/:coupleId/read', async (req, res) => {
  try {
    const { userId } = req.body;
    await Message.updateMany(
      {
        coupleId: req.params.coupleId,
        senderId: { $ne: userId },
        readAt: null
      },
      { readAt: new Date() }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;
