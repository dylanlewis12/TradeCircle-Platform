const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    recipient: {    //User receiving notification
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ["message", "comment", "like", "follow"],
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String, //URL to redirect when clicked

    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }
})

export default mongoose.model("Notification", NotificationSchema);