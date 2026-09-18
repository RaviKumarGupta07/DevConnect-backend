const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const Chat = require("../models/chat");
const router = express.Router();

// 1 get chats for sender and receiver
router.get("/chats/:receiverId", userAuthMiddleware, async (req, res) => {
    try {
        const { loggedInUser } = req;
        const senderId = loggedInUser._id.toString();
        const { receiverId } = req.params;

        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages.senderId", "firstName lastName")
            .populate("participants", "firstName lastName");
            
        if(!chat){
            chat = new Chat({
                participants:[senderId,receiverId],
                messagess:[],
            })
            await chat.save();
        }
        res.send(chat);
    } catch (err) {
        console.error("Error : ", err.message);
        res.status(500).send("something went wrong");
    }
})

module.exports = router;
