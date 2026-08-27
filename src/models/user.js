const mongoose = require("mongoose");
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        minLength: true,
        maxLength: 20,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        // immutable: true,
        validate: (email) => {
            const isEmailValid = validator.isEmail(email);
            if (!isEmailValid) throw new Error("Email Not Valid");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        // min: 18,
        // or 👇
        validate: (value) => {
            if (value < 18) throw new Error(" age must be >= 18")
        }
    },
    gender: {
        type: String,
        // enum:["male","female","other"], 
        // or 👇
        validate: (value) => {
            const arr = ["male", "female", "other"];
            if (!arr.includes(value)) {
                throw new Error("gender must be one of these : male,female,other ")
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    about: {
        type: String,
    },
    skills: {
        type: [String],
        validate: (arr) => {
            if (arr.length > 10) throw new Error(" maximum 10 skills allowed");
        }
    },

})

const User = mongoose.model("User", userSchema);
module.exports = User;