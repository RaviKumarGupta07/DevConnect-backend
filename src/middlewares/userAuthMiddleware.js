const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("invalid token");

        const decodedObj = jwt.verify(token, "DevConnect791");
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