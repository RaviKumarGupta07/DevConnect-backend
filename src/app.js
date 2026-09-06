const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin:"http://localhost:7777",
    credentials:true,
}));
app.use(express.json()); // convert request json body into js object
app.use(cookieParser()); // to parse req.cookies so that server can read

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


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
        console.error("Error : " + err.message);
    })
