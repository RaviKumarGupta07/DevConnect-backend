var validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const validateSignUpReqBody = async (req) => {

    const { emailId, password, photoURL } = req.body;

    const isEmailValid = validator.isEmail(emailId);
    if (!isEmailValid) throw new Error("Email not valid !!");

    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) throw new Error("Password is not strong {it must have => minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1} ");

    // hash passwrod
    const user = new User();
    const hashedPassword = await user.hashPassword(password); // schema.method
    // const myPlaintextPassword = password ;
    // const hashedPassword = await bcrypt.hash(myPlaintextPassword, 10);
    // console.log(hashedPassword);
    req.body.password = hashedPassword;

    if (photoURL) {
        const isPhotoURLValid = validator.isURL(photoURL);
        if (!isPhotoURLValid) throw new Error("photoURL is not valid");
    }

}

const checkEditReqBody = (req) => {
    const allowedFields = ["firstName", "lastName", "age", "gender", "photoURL", "about", "skills"];
    const providedFields = Object.keys(req.body);
    console.log(providedFields);
    return providedFields.every(field => allowedFields.includes(field));
}

module.exports = { validateSignUpReqBody, checkEditReqBody };