const express = require("express");
const { validateSignUpReqBody } = require("../utils/validate");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

// create user api
router.post("/signup", async (req, res) => {
    try {
        await validateSignUpReqBody(req);
        const user = new User(req.body);
        const savedUser = await user.save();
        res.send(`${user.firstName} signed up successfully`);
    }
    catch (err) {
        res.status(500).send("ERRROR : " + err.message);
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
            expires: new Date(Date.now() + 2 * 24 * 3600000), // cookie will be removed after 2 days 
        });

        res.send(`${user.firstName} Logged In `);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// POST /logout
router.post("/logout",(req,res,next)=>{
    res
    .cookie("token",null,{ expires: new Date(Date.now()) })
    .send("Logout successful !!") ;
})


module.exports = router ;