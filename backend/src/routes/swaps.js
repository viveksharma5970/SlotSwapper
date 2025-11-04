import express from 'express';
import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get swappable slots from other users
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Event.find({ 
      status: 'SWAPPABLE', 
      userId: { $ne: req.user._id } 
    }).populate('userId', 'name email');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create swap request
router.post('/swap-request', auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    
    const [mySlot, theirSlot] = await Promise.all([
      Event.findOne({ _id: mySlotId, userId: req.user._id, status: 'SWAPPABLE' }),
      Event.findOne({ _id: theirSlotId, status: 'SWAPPABLE' })
    ]);

    if (!mySlot || !theirSlot) {
      return res.status(400).json({ message: 'Invalid slots for swap' });
    }

    const swapRequest = new SwapRequest({
      requesterUserId: req.user._id,
      targetUserId: theirSlot.userId,
      requesterSlotId: mySlotId,
      targetSlotId: theirSlotId
    });

    await Promise.all([
      swapRequest.save(),
      Event.updateOne({ _id: mySlotId }, { status: 'SWAP_PENDING' }),
      Event.updateOne({ _id: theirSlotId }, { status: 'SWAP_PENDING' })
    ]);

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Respond to swap request
router.post('/swap-response/:requestId', auth, async (req, res) => {
  try {
    const { accepted } = req.body;
    const swapRequest = await SwapRequest.findOne({ 
      _id: req.params.requestId, 
      targetUserId: req.user._id,
      status: 'PENDING'
    });

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (accepted) {
      // Accept swap - exchange slot ownership
      await Promise.all([
        SwapRequest.updateOne({ _id: req.params.requestId }, { status: 'ACCEPTED' }),
        Event.updateOne({ _id: swapRequest.requesterSlotId }, { 
          userId: swapRequest.targetUserId, 
          status: 'BUSY' 
        }),
        Event.updateOne({ _id: swapRequest.targetSlotId }, { 
          userId: swapRequest.requesterUserId, 
          status: 'BUSY' 
        })
      ]);
    } else {
      // Reject swap - revert slots to swappable
      await Promise.all([
        SwapRequest.updateOne({ _id: req.params.requestId }, { status: 'REJECTED' }),
        Event.updateOne({ _id: swapRequest.requesterSlotId }, { status: 'SWAPPABLE' }),
        Event.updateOne({ _id: swapRequest.targetSlotId }, { status: 'SWAPPABLE' })
      ]);
    }

    res.json({ message: accepted ? 'Swap accepted' : 'Swap rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's swap requests
router.get('/requests', auth, async (req, res) => {
  try {
    const [incoming, outgoing] = await Promise.all([
      SwapRequest.find({ targetUserId: req.user._id })
        .populate('requesterUserId', 'name email')
        .populate('requesterSlotId')
        .populate('targetSlotId'),
      SwapRequest.find({ requesterUserId: req.user._id })
        .populate('targetUserId', 'name email')
        .populate('requesterSlotId')
        .populate('targetSlotId')
    ]);

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;