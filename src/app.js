const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
require('dotenv').config();

const port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json()); // convert request json body into js object
app.use(cookieParser()); // to parse req.cookies so that server can read

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = require('http').createServer(app);
initializeSocket(server);

connectDB()
    .then(
        () => {
            console.log("database connection successfull 👍");

            server.listen(port, () => {
                console.log(`backend server started at port no ${port} `);
            })
        }
    )
    .catch((err) => {
        console.error("Error : " + err.message);
    })
