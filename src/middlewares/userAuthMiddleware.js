const jwt = require("jsonwebtoken");

const userAuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("invalid token");

        const decodedObj = jwt.verify(token, "DevConnect791");
        const { _id } = decodedObj;
        if (!_id) throw new Error("invalid token");
        req._id = _id;
        next();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = {
    userAuthMiddleware,
}