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
} from '../controllers/tradesControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTrade);

router.get('/', protect, getTrades);

router.get('/:id', protect, getTrade);

router.get('/history', protect, getUserTradeHistory);

//router.get('/pending', protect, getUserPendingTrades);

router.put('/:id/accept', protect, acceptTrade);

router.put('/:id/decline', protect, declineTrade);

router.put('/:id/cancel', protect, cancelTrade);

router.put('/:id/complete', protect, completeTrade);

//router.post('/:id/rate', protect, rateTrade);

export default router;