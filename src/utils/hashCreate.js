const crypto = require("crypto");

const createHash = (value)=>{
    return crypto.createHash("md5").update(value).digest("hex");
}

module.exports = {createHash} ;