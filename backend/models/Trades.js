const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
    intiator: {
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
        default: null, // null if volunteer
    },
    transactionType: {
        type: String,
        enum: ["exchange", "volunteer"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
        default: "pending",
        index: true,
    },
    hoursRequested: {
        type: Number,
        default: 0,
    },
    message: {
        type: String,
    },
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
});

export default mongoose.model("Trade", TradeSchema);