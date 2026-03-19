import Message from '../models/Message.js';
import Couple from '../models/Couple.js';

export function setupSocketHandlers(io) {
  // Track connected users per couple
  const coupleRooms = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a couple's room
    socket.on('join_couple', async ({ coupleId, userId }) => {
      socket.join(`couple:${coupleId}`);

      if (!coupleRooms.has(coupleId)) {
        coupleRooms.set(coupleId, new Set());
      }
      coupleRooms.get(coupleId).add(userId);

      // Notify partner
      socket.to(`couple:${coupleId}`).emit('partner_online', { userId });
    });

    // Leave couple room
    socket.on('leave_couple', ({ coupleId }) => {
      socket.leave(`couple:${coupleId}`);
    });

    // Send message
    socket.on('send_message', async ({ coupleId, senderId, content, type = 'text', metadata = {} }) => {
      try {
        // Check if fight mode is active
        const couple = await Couple.findById(coupleId);
        if (couple && couple.fightMode && couple.fightMode.active) {
          // Only allow hugs during fight mode
          if (type !== 'hug') {
            socket.emit('fight_mode_active', {
              remainingTime: couple.fightMode.endsAt - Date.now()
            });
            return;
          }
        }

        const message = new Message({
          coupleId,
          senderId,
          content,
          type,
          metadata
        });

        await message.save();
        await message.populate('senderId', 'deviceName');

        // Broadcast to couple
        io.to(`couple:${coupleId}`).emit('new_message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ coupleId, userId, isTyping }) => {
      socket.to(`couple:${coupleId}`).emit('partner_typing', { userId, isTyping });
    });

    // Read receipt
    socket.on('mark_read', async ({ coupleId, userId, messageId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { readAt: new Date() });
        socket.to(`couple:${coupleId}`).emit('message_read', { messageId, readAt: new Date() });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Fight mode
    socket.on('enable_fight_mode', async ({ coupleId, duration }) => {
      try {
        const endsAt = new Date(Date.now() + duration * 60 * 1000);

        await Couple.findByIdAndUpdate(coupleId, {
          'fightMode.active': true,
          'fightMode.startsAt': new Date(),
          'fightMode.endsAt': endsAt
        });

        io.to(`couple:${coupleId}`).emit('fight_mode_started', { duration, endsAt });
      } catch (error) {
        console.error('Enable fight mode error:', error);
      }
    });

    socket.on('disable_fight_mode', async ({ coupleId }) => {
      try {
        await Couple.findByIdAndUpdate(coupleId, {
          'fightMode.active': false
        });

        io.to(`couple:${coupleId}`).emit('fight_mode_ended');
      } catch (error) {
        console.error('Disable fight mode error:', error);
      }
    });

    // Virtual hug (works even during fight mode)
    socket.on('send_hug', async ({ coupleId, senderId }) => {
      console.log('send_hug received', { coupleId, senderId, socketId: socket.id });
      try {
        const message = new Message({
          coupleId,
          senderId,
          content: 'sent a hug',
          type: 'hug'
        });

        await message.save();
        await message.populate('senderId', 'deviceName');

        console.log('Emitting new_message to couple:', `couple:${coupleId}`);
        io.to(`couple:${coupleId}`).emit('new_message', message);
      } catch (error) {
        console.error('Send hug error:', error);
      }
    });

    // Mood update
    socket.on('mood_update', ({ coupleId, userId, mood, note, expiresAt }) => {
      console.log('mood_update received', { coupleId, userId, mood, note, expiresAt });
      // Broadcast mood to partner (not to self)
      socket.to(`couple:${coupleId}`).emit('partner_mood', { mood, note, expiresAt });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
