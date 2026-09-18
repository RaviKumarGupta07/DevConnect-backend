## $or and $and syntax and select field syntax  mongoose (mongodb)
    const result = ModelName.find({
        $or:[
            {q1:q1},
            {q3:q3,q4:q4}, // what ever you want you can 
            {q5:q5},
        ]
    }).select("field1 field2 field3")

    // useCase =>
    const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

    const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(usersToBeHidden) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_FIELDS)
        .limit(pageLimitNumber)
        .skip(skipNumber);

## Comparison Query Predicate Operators (MONGODB DOCS)
###  $eq => Matches values equal to a specified value.
    ref : https://www.mongodb.com/docs/manual/reference/operator/query/eq/#std-label-eq-usage-examples
    syntax :-
    { <field>: { $eq: <value> } }
    examples :-
    db.inventory.find( { tags: "B" } ) <= is equivalent to => 
    db.inventory.find( { tags: {$eq : "B"} } )

    db.inventory.find( { tags: { $eq: [ "A", "B" ] } } );The query is equivalent to:
    db.inventory.find( { tags: [ "A", "B" ] } )

### $gt => selects documents where the value of the field is greater than (>) the specified value.
    syntax :- { field: { $gt: value } }






## $and syntax

## ref & populate 
#### in any schema , in any field inject ref property
    ie : connectionSchema = new mongoose.Schema({
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId
            required:true,
            ref:"User", // "User" is model name
        },toUserId:{
            type: mongoose.Schema.Types.ObjectId
            required:true,
            ref:"User", // "User" is model name
        }
    })

#### while query data , populate data into query
    const results = Model.find({fromUserId,toUserId})
    .populate("fromUserId",USER_FIELDS)
    .populate("toUserId" , USER_FIELDS);

#### while USER_FIELDS contains name of fields which we want to select , ie =>
    // const USER_FIELDS = ["firstName" , "lastName" ,"gender", "age", "about", "skills" ]; 
    // or u can also write
    const USER_FIELDS = "firstName lastName gender age about skills photoURL";

## mongoose Schema type ObjectId
    type: mongoose.Schema.Types.ObjectId

## learnt thought process b/w POST and GET
    - in POST => we cant let attackers send any malicious data
    - in GET => we cant let attackers to fetch any unnecessary data


## Set in javascript
    // initialize set using new Set() constuctor
    const mySet = new Set();
    mySet.add(1);
    mySet.add(1);
    mySet.add(2);
    mySet.add(1);
    mySet.add(2);
    console.log(mySet) ; // Set(2) { 1 ,2 }
### to convert set into array using Array.from(mySet) method
    // The Array.from() static method creates a new,
    // shallow-copied Array instance from an iterable or array-like object.
    // ex.
    console.log(Array.from("foo"));
    // Expected output: Array ["f", "o", "o"]
    console.log(Array.from([1, 2, 3], (x) => x + x));
    // Expected output: Array [2, 4, 6]

    // in my case => converting set into array
    console.log(Array.from(mySet));  // [1,2]


## comparision between two objectId 
### to convert mongoose.Schema.Types.ObjectId into string : using toString() method
    // suppose fromUserId field has type : mongoose.Schema.Types.ObjectId 
    console.log(fromUserId.toString()); // '6a92e5a9f27708e52eb76947'
    // In my projects I have used in comparision 
    console.log(fromUserId.toString() === '6a92e5a9f27708e52eb76947') ; // true
### using .equals() method 
    console.log(loggedInUser._id); // 6a92e5a9f27708e52eb76947
    console.log(fromUserId); // 6a92e5a9f27708e52eb76947
    console.log(fromUserId.equals(loggedInUser._id)) ; // true

# pagination in api - fetching data from #mongodb using #mongoose using .skip() and .limit()
## send page and limit as query parameter in route ie. 
    /user/feed?page=2&limit=5
## add .skip(skipNumber).limit(limitNumber) in querying data 

    try {
        const {page ,limit} = req.query ; // destructur route query params from req
        console.log(page , limit) ;
        // sanitize your page and limit value <= if attacker send any big or corrupt value
        const pageLimitNumber = (limit > 20 ? 20 : limit ) || 5 ;
        const skipNumber = ((page-1)*pageLimitNumber) || 0 ;
        .........some code.........
        .........some code.........
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(usersToBeHidden) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_FIELDS)
        .limit(pageLimitNumber)
        .skip(skipNumber);

        res.json({data : users});
    }

# mongoDB : Docs Home/Development/Query Language/Query Predicates

## Array Query Predicate Operators
    $all :- Matches arrays that contain all elements specified in the query.
    $elemMatch :- 	Selects documents if at least one element in the array field matches all the specified $elemMatch conditions.
    $size :- Selects documents if the array field contains the specified number of elements.

## Comparison Query Predicate Operators
Comparison operators filter data with value comparisons such as less than and greater than.
For comparison of different BSON type values, see the specified BSON comparison order.

    $eq : Matches values equal to a specified value.
    $gt : Matches values greater than a specified value.
    $gte : Matches values greater than or equal to a specified value.
    $in : Matches any values specified in an array.
    $lt : Matches values less than a specified value.
    $lte : Matches values less than or equal to a specified value.
    $ne : Matches all values not equal to a specified value.
    $nin : Matches if the value is not equal to any of a given list of values.

## Data Type Query Predicate Operators
Data type query predicate operators return data based on field existence or data types.

    $exists : Matches documents that have the specified field.
    $type   : Matches documents if a field is of the specified type.

## Logical Query Predicate Operators
Logical operators return data based on boolean logic (and, or, and nor).

- $or : Joins query clauses with a logical OR and returns all documents that match at least one clause. 

        // usecase ie. Give me users who are 22 OR live in Delhi.
        User.find({ $or: [{ age: 22 }, { city: "Delhi" }] })

- $and : Joins query clauses with a logical AND and returns documents that match the conditions of all clauses.

        usecase ie. Give me users who are 22 AND live in Prayagraj.
        User.find({ $and: [{ age: 22 }, { city: "Delhi" }] })

- $nor : Joins query clauses with a logical OR and returns all documents that match at least one clause. 
    - basically $nor rejects a document if even one of the conditions is true.
    - $nor = negate of or
    - $nor = NOT any 

            useCase ie. Give me users who are NOT 22 AND NOT living in Delhi.
            User.find({ $nor: [{ age: 22 }, { city: "Delhi" }] })

- $not : Inverts the effect of a query predicate and returns documents that do not match the query predicate. 
    - $not = opposite of a condition

            useCase ie. Give me users whose age is NOT greater than 22.
            User.find({ age: { $not: { $gt: 22 } } })

## parseInt()
- The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).

        ie. 
        console.log(parseInt("123"));
        // 123 (default base-10)
        console.log(parseInt("123", 10));
        // 123 (explicitly specify base-10)
        console.log(parseInt("   123 "));
        // 123 (whitespace is ignored)
        console.log(parseInt("077"));
        // 77 (leading zeros are ignored)
        console.log(parseInt("1.9"));
        // 1 (decimal part is truncated)
        console.log(parseInt("ff", 16));
        // 255 (lower-case hexadecimal)
        console.log(parseInt("0xFF", 16));
        // 255 (upper-case hexadecimal with "0x" prefix)
        console.log(parseInt("xyz"));
        // NaN (input can't be converted to an integer)

## res.cookie syntax

    // this will store cookie in user's browser
    res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 1 days 
        });

## jwt token syntax

        // this will generate token
        const token = await jwt.sign({ _id: savedUser._id }, 'SECRETKEY_PROVIDEDBYYOU', { expiresIn: '1d' });

        // this will decode your jwt token
        const decodedObj = await jwt.verify(token, 'SECRETKEY_PROVIDEDBYYOU');
        const { _id } = decodedObj;

## .env in backend
- first install dotenv package

        npm i dotenv

- create *.env file* at the **root** of your project
- include .env inside **gitignore**
- assign variables inside .env file like this

        PORT = "7777"
        JWT_SECRET = "secret@123"

    - common  doubts (keep these in mind)
        - quotes are optional
        - never use comma or semicolon inside these variable
- to access these variable inside project

        require('dotenv').config();

        // then 
        const port = process.env.PORT

## socket.io setup in frontend and backend
    https://github.com/RaviKumarGupta07/DevConnect-backend/blob/main/md%20files/SocketIO_Setup_Guide.md

## schema and model creation mongoose

### simple schema and model
    const mongoose = require("mongoose");
    var validator = require('validator');
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    require('dotenv').config();

    const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            trim: true,
            minLength: 3,
            maxLength: 20,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
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
            // select : false ,
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
            validate : (value) =>{
                if(!validator.isURL(value)) throw new Error("photoURL is not valid");
            }
        },
        about: {
            type: String,
            maxLength: 500,
        },
        skills: {
            type: [String],
            validate: (arr) => {
                if (arr.length > 10) throw new Error(" maximum 10 skills allowed");
            }
        },

    })

    userSchema.method("hashPassword", async function (plainTextPassword) {
        const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
        return hashedPassword;
    })

    userSchema.method("getJWT", async function () {
        const user = this;
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return token;
    })

    userSchema.method("validatePassword", async function (plainTextPassword) {
        const user = this;
        const hashedPassword = user.password;
        const isPasswordValid = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isPasswordValid;
    })

    const User = mongoose.model("User", userSchema);
    module.exports = User;

### a little bit complex schema and model 

    const mongoose = require("mongoose");

    const messageSchema = new mongoose.Schema({
        text: {
            type: String,
            trim: true,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
    })

    const chatSchema = new mongoose.Schema({
        participants: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }],
            required: true,
            validate : (value)=>{
                if(value.length<2) throw new Error("A chat must have at least 2 participants.");
            }
        },
        messages: {
            type: [messageSchema],
        }
    }, {
        timestamps: true,
    })

    const Chat = mongoose.model("Chat", chatSchema);
    module.exports = Chat;