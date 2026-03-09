import express from 'express';
import {
  createTrade,
  getTrades,
  getTrade,
  acceptTrade,
  declineTrade,
  cancelTrade,
  completeTrade,
  getUserTradeHistory,
  getUserTradeCount
} from '../controllers/tradeControllers.js';  
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create trade
router.post('/', protect, createTrade);

// Get all trades
router.get('/', protect, getTrades);

// Get trade history and count (MUST come before /:id route)
router.get('/history', protect, getUserTradeHistory);
router.get('/count', protect, getUserTradeCount);

// Get specific trade
router.get('/:id', protect, getTrade);

// Trade actions
router.put('/:id/accept', protect, acceptTrade);
router.put('/:id/decline', protect, declineTrade);
router.put('/:id/cancel', protect, cancelTrade);
router.put('/:id/complete', protect, completeTrade);

export default router;