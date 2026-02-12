import express from 'express';
import {
  createTrade,
  getTrades,
  getTrade,
  acceptTrade,
  declineTrade,
  cancelTrade,
  completeTrade,
  rateTrade,
  getUserTradeHistory,
  getUserPendingTrades
} from '../controllers/tradeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new trade request (protected)
router.post('/', protect, createTrade);

// Get all trades (paginated) (protected)
router.get('/', protect, getTrades);

// Get a specific trade (protected)
router.get('/:id', protect, getTrade);

// Get authenticated user's trade history (protected)
router.get('/history', protect, getUserTradeHistory);

// Get authenticated user's pending trades (protected)
router.get('/pending', protect, getUserPendingTrades);

// Accept a trade request (protected)
router.put('/:id/accept', protect, acceptTrade);

// Decline a trade request (protected)
router.put('/:id/decline', protect, declineTrade);

// Cancel an active trade (protected)
router.put('/:id/cancel', protect, cancelTrade);

// Mark trade as completed (protected)
router.put('/:id/complete', protect, completeTrade);

// Rate user after trade completion (protected)
router.post('/:id/rate', protect, rateTrade);

export default router;