# api lists

## authRouter
- POST /login
- POST /signup
- POST /logout

## profileRouter
- GET /profile
- POST /profileEdit
- POST /passwordUpdate

## requestRouter
- POST /request/send/:status/:toUserId  <= allowedStatus = ["interested" , "ignored"]
    - this api is for either ignoring any user or showing some interest to any user.
- POST /request/review/:status/:fromUserId <= allowedStatus = ["accepted" ,"rejected" ]
    - this api is for either accepting or rejecting the connection request

## userRouter
- GET /user/sentRequests 
    - this will fetch all the connectionRequests which are sent to user 
    - only those request a user can see which was sent by another user and status is "interested" ,
- GET /user/connections
    - this will fetch all the connections of the loggedInUser
- GET /user/feed 

