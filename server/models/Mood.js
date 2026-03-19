import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['happy', 'loved', 'neutral', 'sad', 'angry', 'anxious', 'excited', 'tired'], required: true },
  note: { type: String, maxLength: 280 },
  timestamp: { type: Date, default: Date.now }
});

moodSchema.index({ coupleId: 1, timestamp: -1 });

export default mongoose.model('Mood', moodSchema);
