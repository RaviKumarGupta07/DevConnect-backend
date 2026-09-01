## $or syntax
const result = ModelName.find({
    $or:[
        {q1:q1},
        {q3:q3,q4:q4}, // what ever you want you can 
        {q5:q5},
    ]
})

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