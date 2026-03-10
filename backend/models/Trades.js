import mongoose from "mongoose";

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
  skillOffering: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  skillExchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    default: null,
  },
  transactionType: {
    type: String,
    enum: ["exchange", "volunteer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "declined"],
    default: "pending",
    index: true,
  },
  hoursRequested: {
    type: Number,
    default: 0,
  },
  timeframe: {
    type: String,
    enum: ["asap", "1 week", "2 weeks", "1 month", "flexible"],
    default: "flexible",
  },
  notes: {
    type: String,
    default: "",
  },
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
  declinedAt: {
    type: Date,
  },
  initiatorRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  receiverRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  initiatorReview: {
    type: String,
    default: "",
  },
  receiverReview: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Indexes for performance
TradeSchema.index({ initiator: 1, status: 1 });
TradeSchema.index({ receiver: 1, status: 1 });
TradeSchema.index({ createdAt: -1 });

export default mongoose.model("Trade", TradeSchema);