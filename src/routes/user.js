const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

// const USER_FIELDS = ["firstName" , "lastName" ,"gender", "age", "about", "skills" ]; // or
const USER_FIELDS = "firstName lastName gender age about skills photoURL";

// fetch all the requests data which is sent by others and received by loggedInUser
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

// fetch all the users data who are in the user's connection 
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

// fetch all the users data for the loggedInUser feed
router.get("/user/feed", userAuthMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) ;
        const limit = parseInt(req.query.limit);
        // sanitize your limit value 
        const pageLimitNumber = (limit > 20 ? 20 : limit ) || 5 ;
        const skipNumber = ((page-1)*pageLimitNumber) || 0 ;

        const { loggedInUser } = req;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");
        const usersToBeHidden = new Set();
        connectionRequests.forEach((obj, index) => {
            usersToBeHidden.add(obj.fromUserId.toString());
            usersToBeHidden.add(obj.toUserId.toString());
        });
        
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(usersToBeHidden) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_FIELDS)
        .limit(pageLimitNumber)
        .skip(skipNumber);

        res.json({ data: Array.from(users) });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router;