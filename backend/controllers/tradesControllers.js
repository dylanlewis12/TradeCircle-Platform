import Trade from '../models/Trades.js';
import Skill from '../models/Skills.js';
import User from '../models/User.js';

// Create a new trade request
export const createTrade = async (req, res) => {
  try {
    const initiatorId = req.user.id;
    const { receiverId, skillOfferingId, skillInExchangeId, transactionType, hoursRequested, message } = req.body;

    // Validate required fields
    if (!receiverId || !skillOfferingId || !transactionType) {
      return res.status(400).json({ message: "Missing required fields: receiverId, skillOfferingId, transactionType" });
    }

    // Validate transactionType
    if (!["exchange", "volunteer"].includes(transactionType)) {
      return res.status(400).json({ message: "Invalid transactionType. Must be 'exchange' or 'volunteer'" });
    }

    // Verify initiator and receiver exist
    const initiator = await User.findById(initiatorId);
    const receiver = await User.findById(receiverId);

    if (!initiator || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify skill offering exists
    const skillOffering = await Skill.findById(skillOfferingId);
    if (!skillOffering) {
      return res.status(404).json({ message: "Skill offering not found" });
    }

    // If exchange, verify skill in exchange exists
    let skillInExchange = null;
    if (transactionType === "exchange" && skillInExchangeId) {
      skillInExchange = await Skill.findById(skillInExchangeId);
      if (!skillInExchange) {
        return res.status(404).json({ message: "Skill in exchange not found" });
      }
    }

    // Create new trade
    const newTrade = new Trade({
      initiator: initiatorId,
      receiver: receiverId,
      skillOffering: skillOfferingId,
      skillInExchange: skillInExchangeId || null,
      transactionType,
      hoursRequested: hoursRequested || 0,
      message: message || "",
      status: "pending"
    });

    await newTrade.save();

    // Populate trade with user and skill info
    await newTrade.populate([
      { path: 'initiator', select: 'userName profilePicture' },
      { path: 'receiver', select: 'userName profilePicture' },
      { path: 'skillOffering', select: 'name category' },
      { path: 'skillInExchange', select: 'name category' }
    ]);

    res.status(201).json({
      message: "Trade request created successfully",
      trade: newTrade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trades (paginated)
export const getTrades = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter - trades involving the authenticated user
    let filter = {
      $or: [
        { initiator: userId },
        { receiver: userId }
      ]
    };

    if (status) {
      filter.status = status;
    }

    const trades = await Trade.find(filter)
      .populate('initiator', 'userName profilePicture rating')
      .populate('receiver', 'userName profilePicture rating')
      .populate('skillOffering', 'name category')
      .populate('skillInExchange', 'name category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalTrades = await Trade.countDocuments(filter);
    const totalPages = Math.ceil(totalTrades / limit);

    res.status(200).json({
      message: "Trades retrieved successfully",
      trades,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTrades,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific trade
export const getTrade = async (req, res) => {
  try {
    const { id } = req.params;

    const trade = await Trade.findById(id)
      .populate('initiator', 'userName profilePicture rating email')
      .populate('receiver', 'userName profilePicture rating email')
      .populate('skillOffering', 'name category description')
      .populate('skillInExchange', 'name category description');

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json({
      message: "Trade retrieved successfully",
      trade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a trade request
export const acceptTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Only receiver can accept
    if (trade.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Only the receiver can accept this trade" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ message: "Trade is not pending" });
    }

    trade.status = "accepted";
    trade.acceptedAt = Date.now();
    await trade.save();

    await trade.populate([
      { path: 'initiator', select: 'userName profilePicture' },
      { path: 'receiver', select: 'userName profilePicture' },
      { path: 'skillOffering', select: 'name category' },
      { path: 'skillInExchange', select: 'name category' }
    ]);

    res.status(200).json({
      message: "Trade accepted successfully",
      trade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline a trade request
export const declineTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Only receiver can decline
    if (trade.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Only the receiver can decline this trade" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ message: "Trade is not pending" });
    }

    trade.status = "cancelled";
    trade.cancelledAt = Date.now();
    await trade.save();

    res.status(200).json({
      message: "Trade declined successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a trade
export const cancelTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Only initiator can cancel
    if (trade.initiator.toString() !== userId) {
      return res.status(403).json({ message: "Only the initiator can cancel this trade" });
    }

    if (!["pending", "accepted"].includes(trade.status)) {
      return res.status(400).json({ message: "Only pending or accepted trades can be cancelled" });
    }

    trade.status = "cancelled";
    trade.cancelledAt = Date.now();
    await trade.save();

    res.status(200).json({
      message: "Trade cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark trade as completed
export const completeTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Both users can mark complete (agreement required)
    if (trade.initiator.toString() !== userId && trade.receiver.toString() !== userId) {
      return res.status(403).json({ message: "You are not involved in this trade" });
    }

    if (trade.status !== "accepted") {
      return res.status(400).json({ message: "Trade must be accepted before completing" });
    }

    trade.status = "completed";
    trade.completedAt = Date.now();
    await trade.save();

    await trade.populate([
      { path: 'initiator', select: 'userName profilePicture' },
      { path: 'receiver', select: 'userName profilePicture' },
      { path: 'skillOffering', select: 'name category' },
      { path: 'skillInExchange', select: 'name category' }
    ]);

    res.status(200).json({
      message: "Trade completed successfully",
      trade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user's trade history (completed trades)
export const getUserTradeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const trades = await Trade.find({
      $or: [
        { initiator: userId },
        { receiver: userId }
      ],
      status: "completed"
    })
      .populate('initiator', 'userName profilePicture rating')
      .populate('receiver', 'userName profilePicture rating')
      .populate('skillOffering', 'name category')
      .populate('skillInExchange', 'name category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ completedAt: -1 });

    const totalTrades = await Trade.countDocuments({
      $or: [
        { initiator: userId },
        { receiver: userId }
      ],
      status: "completed"
    });

    const totalPages = Math.ceil(totalTrades / limit);

    res.status(200).json({
      message: "Trade history retrieved successfully",
      trades,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTrades,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};