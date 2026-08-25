const adminAuthMidddleware = (req, res, next) => {
    const token = "abc";
    if (token === "abc") {
        next();
    }
    else {
        res.status(401).send("unauthorize");
    }
};

module.exports = {
    adminAuthMidddleware,
}