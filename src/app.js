const express = require("express");
const { adminAuthMidddleware } = require("./middlewares/adminAuthMidddleware");
const { userAuthMiddleware } = require("./middlewares/userAuthMiddleware");
const app = express();

// const handler = (req, res) => {
//     res.send("handler");
// }
// app.get(/\/ab?cd/,handler) // b optional
// app.get(/\/ab*cd/,handler); // b* => 0 b or more bs
// app.get(/\/ab+cd/ , handler); // b* => 1 b or more
// app.get(/\/a(bc)?d/ , handler) ; // (bc) optional
// app.get(/\/ab.*cd/,handler); // ab+zero or more characters+cd
// app.get(/a/,handler);
// app.get(/\/a/, handler);
// app.get(/\/.*fly$/,handler);

app.use("/admin",
    adminAuthMidddleware,   // /admin and all sub-routes
)

// app.all("/admin",
//     adminAuthMidddleware, // only exact /admin, all HTTP methods
// )

app.get("/admin/getAllUsers", (req, res) => {
    res.send("all users data")
})

app.get("/user/login", (req, res) => {
    res.send("/user/login route handler")
})

app.use("/user",
    userAuthMiddleware,
    (req, res) => {
        res.send("user Data after authentication");
    }
)


app.get("/test", [(req, res, next) => {
    console.log("1st route handler");
    // res.send("response from 1st round handler") ;
    next();
},
[(req, res, next) => {
    console.log("2nd route handler");
    // res.send("response from 2nd route handler")
    next();
},
(req, res, next) => {
    console.log("3rd route handler");
    // res.send("res from 3rd rh");
    next();
}],
(req, res, next) => {
    console.log("4th route handler");
    res.send("res from 4th rh");
}])

// app.get("/test/:id/:address" , (req,res)=>{
//     console.log("dynamic parameter read")
//     console.log(req.params);
//     res.send("dynamic parameter read")
// })

// app.get("/test", (req, res) => {
//     console.log("query parameters read");
//     console.log(req.query);
//     res.send({
//         name: "Ravi",
//         state: "UP"
//     })
// })

app.post("/test", (req, res) => {
    res.send("post req for test route.");
})
app.put("/test", (req, res) => {
    res.send("put req for test route.")
})
app.patch("/test", (req, res) => {
    res.send("patch req for test route.")
})
app.delete("/test", (req, res) => {
    res.send("delete request for test route.")
})

// app.use("/hello",(req,res)=>{
//     res.send("Hello Hello Hello")
// })

// app.use("/test",(req,res)=>{
//     res.send("Test Test Test ");
// })

// app.use("/",(req,res)=>{
//     res.send("Namaste paji ");
// })

app.listen(7777, () => {
    console.log("backend server started at port no 7777 ");
})