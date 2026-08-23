const express = require("express") ;
const app = express();

app.use("/test",(req,res)=>{
    res.send("Namaste paji Test ");
})
// app.use("/",(req,res)=>{
//     res.send("Namaste paji ");
// })

app.listen(7777,()=>{
    console.log("backend server started at port no 7777 ");
})