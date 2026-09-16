const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

const userAuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).send("Please Login !");

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;
        if (!_id) throw new Error("invalid token");
        req._id = _id;
        const loggedInUser = await User.findById(_id);
        req.loggedInUser = loggedInUser ;
        next();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}


module.exports = {
    userAuthMiddleware,
}