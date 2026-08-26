const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); // convert request json body into js object

// create user api
app.post("/signup", async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    await user.save()
        .then(() => {
            // throw new Error("just checking 🤪")
            res.send("User signed up successfully");
        })
        .catch((err) => {
            console.log("error ocured while creating document : " + err.message);
            res.status(500).send("error ocured while creating document : " + err.message);
        });
})

// get user api
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user
            = await User.findById(req.body.userId)
        // = await User.find({ emailId: userEmail });
        // = await User.findOne({ emailId: userEmail });

        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(400).send("something went wrong");
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
        if (deletedUser){
            res.send("user deleted")
        }else{
            res.status(400).send("something wrong , check user id" );
        }
    } catch (err) {
        res.status(400).send("something went wrong");
    }
})

// update user
app.patch("/update",async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.body.userId , req.body );
        console.log(user);
        if(user){
            res.send("User Updated Successfully");
        }else{
            res.status(400).send("something went wrong /update")
        }
    }catch(err){
        res.status(400).send("something went wrong !!");
    }
})

connectDB()
    .then(
        () => {
            // const obj = {name:"rr"};
            // const arr = [];
            // // console.log(obj===true);
            // if(arr) console.log(true)+ " arr";
            // else console.log(false);
            console.log("database connection successfull 👍")
            app.listen(7777, () => {
                console.log("backend server started at port no 7777 ");
            })
        }
    )
    .catch((err) => {
        console.log("Error occured : " + err.message);
    })
