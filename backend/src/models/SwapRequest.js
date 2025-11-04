import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requesterUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  targetSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

export default mongoose.model('SwapRequest', swapRequestSchema);