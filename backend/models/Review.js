//reviewer, reviewed, trade, score, text, createdAt
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    reviewed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    trade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trade",
        required: true,
        index: true
    },
    score: {
        type: Number,
        min: [1, 'Score must be a value between 1 and 5'],
        max: [1, 'Score must be a value between 1 and 5'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Review", ReviewSchema);