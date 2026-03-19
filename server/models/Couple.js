import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  settings: {
    fightModeDuration: { type: Number, default: 30 },
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '22:00' },
      end: { type: String, default: '07:00' }
    }
  },
  fightMode: {
    active: { type: Boolean, default: false },
    startsAt: { type: Date },
    endsAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Couple', coupleSchema);
