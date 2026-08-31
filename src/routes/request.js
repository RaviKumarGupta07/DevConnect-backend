const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const User = require("../models/user");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

router.post("/request/send/:status/:toUserId", userAuthMiddleware, async (req, res) => {
    try {
        const { loggedInUser } = req;
        const fromUserId = loggedInUser._id;
        const { status, toUserId } = (req.params);

        const allowed_status = ["ignored" ,"interested"];
        if(!allowed_status.includes(status)) throw new Error(`invalid request status : ${status} `);

        // if (fromUserId.equals(toUserId)) { // handled by connectionRequestSchema.pre('save', function() {..})
        //     return res.status(400).send({ message: `cant send ${status} request to same user` });
        // }

        const toUser = await User.findById(toUserId);
        if(!toUser) throw new Error(`The User , which you wnat to send ${status} request, does not exist`);

        const existingConnectionReqs = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        console.log("existing :", existingConnectionReqs);
        if (existingConnectionReqs) {
            return res.status(400).send({ message: "This connection request already exist" });
        }
        const conectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await conectionRequest.save();

        res.send(`${loggedInUser.firstName} sent ${status} request to ${toUser.firstName}`);
    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
})

module.exports = router;