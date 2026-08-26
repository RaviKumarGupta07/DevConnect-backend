const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Raj",
        lastName: "Kumar",
        phone: 1122334488,
        address: "UP, ftp",
        age: 20,
    };
    const user = new User(userObj);
    await user.save()
    .then(()=>{
        // throw new Error("just checking 🤪")
        res.send("User signed up successfully");
    })
    .catch((err)=>{
        console.log("error ocured while creating document : "+err.message);
        res.status(500).send("error ocured while creating document : "+err.message);
    });
    
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
        console.log("Error occured : " + err.message);
    })
