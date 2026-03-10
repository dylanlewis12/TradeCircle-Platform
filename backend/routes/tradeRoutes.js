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
  getUserTradeCount,
  rateTrade
} from '../controllers/tradeControllers.js';  
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/history/user', protect, getUserTradeHistory);  
router.get('/count/user', protect, getUserTradeCount);   

// Create trade
router.post('/', protect, createTrade);

// Get all trades
router.get('/', protect, getTrades);

router.get('/:id', protect, getTrade);

// Trade actions
router.put('/:id/accept', protect, acceptTrade);
router.put('/:id/decline', protect, declineTrade);
router.put('/:id/cancel', protect, cancelTrade);
router.put('/:id/complete', protect, completeTrade);
router.put('/:id/rate', protect, rateTrade);

export default router;