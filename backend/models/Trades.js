import mongoose from "mongoose";

// ============================================
// TRADE SCHEMA (FIXED)
// ============================================

const TradeSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  
  // Skill being offered (required for both exchange and volunteer)
  skillOffering: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  
  // Skill being requested (null if volunteer)
  skillExchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    default: null,
  },
  
  // Transaction type
  transactionType: {
    type: String,
    enum: ["exchange", "volunteer"],
    required: true,
  },
  
  // Trade status progression
  status: {
    type: String,
    enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
    default: "pending",
    index: true,
  },
  
  // Hours requested for the skill (optional)
  hoursRequested: {
    type: Number,
    default: 0,
  },
  
  // Timeframe for the trade
  timeframe: {
    type: String,
    enum: ["asap", "1 week", "2 weeks", "1 month", "flexible"],
    default: "flexible",
  },
  
  // Additional notes about the trade
  notes: {
    type: String,
    default: "",
  },
  
  // Link to conversation/chat
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  acceptedAt: {
    type: Date,
  },
  
  completedAt: {
    type: Date,
  },
  
  cancelledAt: {
    type: Date,
  },
  
  // Optional: ratings after completion
  initiatorRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  
  receiverRating: {    
    type: Number,
    min: 1,
    max: 5,
  },
  
  // Optional: feedback
  initiatorFeedback: String,
  receiverFeedback: String,
});

// Indexes for performance
TradeSchema.index({ initiator: 1, status: 1 });
TradeSchema.index({ receiver: 1, status: 1 });
TradeSchema.index({ createdAt: -1 });

export default mongoose.model("Trade", TradeSchema);
