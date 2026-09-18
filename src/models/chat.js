const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const chatSchema = new mongoose.Schema({
    participants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        required: true,
        validate: (value) => {
            if (value.length < 2) throw new Error("A chat must have at least 2 participants.");
        }
    },
    messages: {
        type: [messageSchema],
    }
}, {
    timestamps: true,
})

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;

