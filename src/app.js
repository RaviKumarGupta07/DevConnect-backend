const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
var validator = require('validator');
const { isURL } = require("validator");
const { validateSignUpReqBody } = require("./utils/validateSignUpReqBody");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuthMiddleware } = require("./middlewares/userAuthMiddleware");

app.use(express.json()); // convert request json body into js object
app.use(cookieParser()); // to parse req.cookies so that server can read

// create user api
app.post("/signup", async (req, res) => {
    try {
        await validateSignUpReqBody(req);
        const user = new User(req.body);
        const savedUser = await user.save();
        res.send("User signed up successfully");
    }
    catch (err) {
        res.status(500).send("ERRROR : " + err.message);
    };
})

// POST /login
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // email exist or not
        const user = await User.findOne({ emailId: emailId });
        if (!user) throw new Error("Invalid Credential !");

        const myPlaintextPassword = password;
        const hashedPassword = user.password;

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

        res.send("User Logged In ");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// get user api
app.get("/profile", userAuthMiddleware, async (req, res) => {
    try {
        const { _id } = req;
        const user = await User.findById(_id);
        if (!user) res.status(404).send("No data Found");
        else res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuthMiddleware, async (req, res) => {
    try {
        const { _id } = req;
        const user = await User.findById(_id);
        res.send(user.firstName + " sent connection request .");
    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
})

// get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("users not found")
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong !!")
    }
})

// delete user 
app.delete("/delete", async (req, res) => {
    try {
        const deletedUser
            = await User.findByIdAndDelete(req.body.userId);
        if (deletedUser) {
            res.send("user deleted")
        } else {
            res.status(400).send("something wrong , check user id");
        }
    } catch (err) {
        res.status(400).send("something went wrong");
    }
})

// update user
app.patch("/update/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const ALLOWED_UPDATE_FIELDS = ["firstName", "lastName", "age", "gender", "about", "skills", "photoURL"];
    const dataObj = req.body;
    const provided_fields = Object.keys(dataObj);
    // console.log(userId);
    try {
        if (!provided_fields.every(field =>
            ALLOWED_UPDATE_FIELDS.includes(field))) {
            throw new Error("  ALLOWED_UPDATE_FIELDS are firstName, lastName, age, gender, about, skills, photoURL ")
        }
        const user = await User.findByIdAndUpdate(userId, dataObj, { runValidators: true });
        // console.log(user);
        if (user) {
            res.send("User Updated Successfully");
        } else {
            res.status(400).send("something went wrong /update")
        }
    } catch (err) {
        res.status(400).send("user profile update error =>" + err.message);
    }
})


connectDB()
    .then(
        () => {
            console.log("database connection successfull 👍")
            app.listen(7777, () => {
                console.log("backend server started at port no 7777 ");
            })
        }
    )
    .catch((err) => {
        res.status(500).send("Error : " + err.message);
    })
