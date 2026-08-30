const express = require("express");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");
const User = require("../models/user");
const router = express.Router();
const { checkEditReqBody } = require("../utils/validate");
const validator = require("validator");

// get user api
router.get("/profile", userAuthMiddleware, async (req, res) => {
    try {
        const { _id } = req;
        const user = await User.findById(_id);
        if (!user) res.status(404).send("No data Found");
        else res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

router.patch("/profileEdit", userAuthMiddleware, async (req, res) => {
    try {
        const isReqBodyValid = checkEditReqBody(req);
        if (!isReqBodyValid) throw new Error("invalid field sent !");

        const { loggedInUser } = req;
        const providedFields = Object.keys(req.body);
        providedFields.forEach((field) => {
            req.loggedInUser[field] = req.body[field];
        })

        const updatedProfile = await loggedInUser.save();
        res.send({
            message: `${loggedInUser.firstName} , your profile updated succesfully !`,
            updatedProfile: updatedProfile,
        })

    } catch (err) {
        res.send("ERROR : " + err.message)
    }
})

router.patch("/passwordUpdate", userAuthMiddleware,async (req, res) => {
    try {
        const newPassword = req.body.password ;
        if(!validator.isStrongPassword(newPassword)) throw new Error("Password is not strong {it must have => minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1} ")
        
        const { loggedInUser } = req ;
        const newHashPassword = await loggedInUser.hashPassword(newPassword) ;

        loggedInUser.password = newHashPassword;
        await loggedInUser.save();
        res.send(`Dear ${loggedInUser.firstName} your password Updated Successfully !`)

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = router;