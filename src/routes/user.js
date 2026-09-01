const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();

// const USER_FIELDS = ["firstName" , "lastName" ,"gender", "age", "about", "skills" ]; // or
const USER_FIELDS = "firstName lastName gender age about skills photoURL";

router.get("/user/recievedRequests", userAuthMiddleware, async (req, res) => {
    try {
        const { loggedInUser } = req;

        const connectionReqs = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate('fromUserId', USER_FIELDS)
        // console.log(connectionReqs);
        res.json(connectionReqs);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

router.get("/user/connections", userAuthMiddleware, async (req, res) => {
    try {
        const { loggedInUser } = req;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                }
            ],
        }).populate("fromUserId", USER_FIELDS)
            .populate("toUserId", USER_FIELDS);

        const data = connectionRequests.map((row) => {
            if (loggedInUser._id.toString() === row.fromUserId.toString()) {
                console.log("loggedInUser._id.toString() === row.fromUserId.toString() ");
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        })

        res.json(data);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = router;