const userAuthMiddleware = (req,res,next)=>{
    const token = "abc";
    if(token === "abc"){
        next();
    }else{
        res.status(401).send("unauthorized");
    }
}

module.exports = {
    userAuthMiddleware ,
}