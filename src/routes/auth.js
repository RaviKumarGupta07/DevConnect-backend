const express = require("express");
const { validateSignUpReqBody } = require("../utils/validate");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

// create user api post/signup
router.post("/signup", async (req, res) => {
    try {
        await validateSignUpReqBody(req);
        const isEmailExist = await User.findOne({emailId : req.body.emailId});
        if(isEmailExist) throw new Error("This Email already exist !")

        const user = new User(req.body);
        const savedUser = await user.save();
        // token generate having userId in payload
        const token = jwt.sign({ _id: savedUser._id }, 'DevConnect791', { expiresIn: '1d' });
        // send token as res.cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 1 days 
        });

        res.json(savedUser);
    }
    catch (err) {
        res.status(500).send("ERROR : " + err.message);
    };
})

// POST /login
router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // email exist or not
        const user = await User.findOne({ emailId: emailId });
        if (!user) throw new Error("Invalid Credential !");

        // const myPlaintextPassword = password;
        // const hashedPassword = user.password;

        // password validation
        const isPasswordCorrect = await user.validatePassword(password); // using Schema.method
        // const isPasswordCorrect = await bcrypt.compare(myPlaintextPassword, hashedPassword);
        if (!isPasswordCorrect) throw new Error("Invalid Credential !");

        // token generate and stored in cookie
        const token = await user.getJWT();// using Schema.method
        // const token = await jwt.sign({ _id: user._id }, 'DevConnect791', { expiresIn: '2d' }); 
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 1 days 
        });

        res.json(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// POST /logout
router.post("/logout", (req, res, next) => {
    res
        .cookie("token", null, { expires: new Date(Date.now()) })
        .send("Logout successful !!");
})


module.exports = router;