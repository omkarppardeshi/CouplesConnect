import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  credentialID: { type: String, unique: true, required: true },
  credentialPublicKey: { type: String, required: true },
  deviceName: { type: String, default: 'My Device' },
  counter: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
