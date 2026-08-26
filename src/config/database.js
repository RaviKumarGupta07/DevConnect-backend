const mongoose = require("mongoose") ;

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://iamrkg2_db_user:t5Fc0hCMqEg4xUSq@pranamnodejscluster.upnrhia.mongodb.net/devConnect");
}

module.exports = connectDB ;