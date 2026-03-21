import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['text', 'hug', 'song', 'question', 'spicy_position', 'spicy_question'], default: 'text' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now },
  readAt: { type: Date }
});

messageSchema.index({ coupleId: 1, timestamp: -1 });

export default mongoose.model('Message', messageSchema);
