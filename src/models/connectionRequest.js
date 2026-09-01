const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref : "User",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not supported"
        }
    },
}, { timestamps: true });

// indexing
connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
})

// pre method
connectionRequestSchema.pre('save', function () {
    const connectionRequest = this;
    const { fromUserId, toUserId, status } = this;
    if (fromUserId.equals(toUserId)) throw new Error(`Cant send ${status} request to same user .`)
});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;