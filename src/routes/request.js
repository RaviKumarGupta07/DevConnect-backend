const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const User = require("../models/user");
const router = express.Router();

router.post("/sendConnectionRequest", userAuthMiddleware, async (req, res) => {
    try {
        const { _id } = req;
        const user = await User.findById(_id);
        res.send(user.firstName + " sent connection request .");
    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
})

module.exports = router ;