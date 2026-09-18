# DevConnect-backend

- Created a repository.
- Initialized a repository.
- `node_modules`, `package.json`, `package-lock.json`.
- Installed Express.
- Created a server.
- Made the server listen on port `7777`.
- Written request handlers for `/test` and `/hello`.
- Installed Nodemon and updated scripts in `package.json`.

---

## Git & GitHub

- Initialized Git.
- Created `.gitignore` and included `node_modules`.
- Created a remote repository on GitHub.
- Pushed all code to the remote `origin`.

---

## Express Routes

- Played with routes using the `app.use("/route", (req, res) => {})` method:
    - `/`
    - `/test`
    - `/hello`

- Learnt that the **order of routes matters a lot**.
- By default, URLs we put in the browser are **GET API calls**.

### Testing Other HTTP Methods

- For testing other HTTP methods in Chrome Console:

      fetch("http://localhost:7777/test", {
          method: "DELETE",
          body: "some stuff.."
      })

- **Good Practice:** For testing HTTP methods, use **Postman**.

### Postman

- Created a workspace.
- Created a test collection.
- Written logic to handle:
    - GET
    - POST
    - PATCH
    - PUT
    - DELETE

- Tested all of them using Postman.

---

## Express Routing

- Explored routing and the use of:
    - `?`
    - `*`
    - `+`
    - `()`

- Used regex in routes:

      /a/
      /.*fly$/

### Query Parameters

- Read query parameters using `req.query`:

      /user?id=123&address=UP

### Dynamic Route Parameters

- Read dynamic route parameters using `req.params`:

      /user/:id/:address

---

## Middleware

- Learnt:
    - What are middlewares?
    - Why do we need them?
    - How Express.js basically handles requests behind the scenes?
    - Difference between `app.use()` and `app.all()`.

- Written a dummy authentication middleware for admin.
- Written a dummy authentication middleware for all user routes except `/user/login`.

### Error Handling

- Implemented error handling using:

      app.use("/", (err, req, res, next) => {})

---

# MongoDB & Mongoose

- Installed Mongoose:

      npm install mongoose

- Mongoose helps communicate between our backend and database.
    - Performs CRUD operations.
    - Handles database connection.

### Database Connection

- Created:

      src/config/database.js

- Created `connectDB` function.

- Used the following URI:

      ...mongodb.net/devConnect

- It creates the `devConnect` database if it does not exist.

- **AKS:** Follow Mongoose resources and best practices.

- Imported the `connectDB` function into `app.js`.

- Followed the best practice:
    - First connect to the database.
    - Then make the app listen for incoming requests.

---

## User Schema & Model

- Created `userSchema` inside:

      src/models/userSchema.js

- Created the model:

      mongoose.model("User", userSchema)

- Industry standard says to keep the first letter capitalized in the model name.

---

## Signup API

- Created `POST /signup` route.
- Created documents inside the `devConnect` database.
- Added error handling using a `try...catch` block.

### Saving POST Data

- Learnt how to save POST data using `req.body`.

- In Postman:

      POST /signup
      Body > raw > JSON

- Learnt the difference between a **JSON object** and a **JavaScript object**.

---

## Find User APIs

### GET `/user`

- Created API for finding a user.

- Using:

      Model.find({ emailId: req.body.email })

- Using:

      Model.findOne({})

- Using:

      Model.findById(id)

  or:

      Model.findById({ _id: id })

- **AKS:** Use Mongoose documentation for more information.

---

## Find All Users

### GET `/feed`

- Created API to find all users.

      Model.find({})

- **AKS:** Use Mongoose documentation for more information.

---

## Delete User

### DELETE `/delete`

- Created API to delete a user by ID.

      findByIdAndDelete(req.body.id)

- **AKS:** Use Mongoose documentation for more information.

---

## Update User

### PATCH `/update`

- Created API to update a user.

      findByIdAndUpdate(req.body.id, { req.body })

- **AKS:** Use Mongoose documentation for more information.

---

# Schema Validation

- Added validation in the schema using Mongoose type schema options and type-specific options on each field of the `userSchema`.

- Used:

      required
      trim
      lowercase
      unique
      default
      validate: (v) => v
      match: /regex/

---

## Validator Library

- Explored the `npm validator` library.

- Used:
    - `isEmail`
    - `isStrongPassword`
    - `isURL`

---

## Sanitization — API-Level Validation

- Implemented API-level validation for:
    - `POST /signup`
    - `PATCH /update`

- Example:
    - `emailId` and `password` should not be updated in `PATCH /update`.

- 💀 **Never trust `req.body`.** This is why sanitization is needed.

- Fields such as:

      skills: { type: [String] }

  should not have more than **10 elements** for:
    - `POST /signup`
    - `PATCH /update`

- Validated data in the Signup API using a helper/utility function inside:

      src/utils

---

# Password Authentication

- Installed the `bcrypt` library.

- Created a password hash using:

      bcrypt.hash

## Login API

- Created Login API.
- Checked whether the email exists in the database.
- Compared the password.
- Threw an error if the password is invalid.

---

# Cookies & JWT Authentication

## Cookie Parser

- Installed `cookie-parser`:

      npm install cookie-parser

- `cookie-parser` provides middleware to read cookies.

- Sent a dummy cookie to the user for learning purposes.

- Created:

      GET /profile

- Checked whether the cookie was received back correctly.

---

## JSON Web Token

- Installed `jsonwebtoken`:

      npm install jsonwebtoken

- In the Login API:
    - Validated email and password.
    - Generated a JWT.
    - Sent the JWT to the user in cookies.

- Read the cookie inside the Profile API.
- Used the cookie to find the logged-in user.

---

## User Authentication Middleware

- Injected authentication logic into `userAuth` middleware.
- This middleware handles the HTTP request and checks whether the user is logged in or not.

- Added the `userAuth` middleware to:
    - `GET /profile`
    - `POST /sendConnectionRequest`

- Set the expiry of the JWT token and cookies to **7 days**.

---

## User Schema Methods

- Created a `userSchema` method to get the JWT token:

      getJWT()

- Created a `userSchema` method to compare passwords:

      validatePassword(plainTextPassword)

---

# 11. API Routes & Routers

- Created an `apiList.md` file to list all the APIs that I can think of.
- Grouped multiple routes under respective routers.
- Read multiple documentations for `express.Router`.
- Created a `routes` folder for managing:
    - Auth routes
    - Profile routes
    - Request routes

- Created:
    - `authRouter`
    - `profileRouter`
    - `requestRouter`

- Imported these routers into `app.js`.

### APIs Created

- `POST /logout`
- `PATCH /profile/edit`
- `PATCH /passwordUpdate`

- Made sure to validate all data in every `POST` and `PATCH` API.

---

# 12. Connection Request

- Created `connectionRequestSchema`.

## Connection Request API

- Created a dynamic route:

      POST /request/send/:status/:userId

### Validation

- Included almost all corner cases.

- Allowed statuses:

      allowedStatus = ["ignored", "interested"]

- Prevented users from sending requests to themselves:

      if (fromUserId.equals(toUserId)) {
          throw new Error("no user can send req to himself");
      }

- Prevented sending multiple connection requests:

      if (connectionRequestAlreadyExists) {
          throw new Error("no user send request more than 1");
      }

---

## Mongoose Pre-Save Middleware

- Created:

      connectionRequestSchema.pre("save", function() {
          ...
      })

---

## Compound Indexing

- Implemented compound indexing for faster responses.

- Example: If 1 million connection requests exist, indexing can help improve query performance.

      // indexing
      connectionRequestSchema.index({
          fromUserId: 1,
          toUserId: 1
      });

---

# 13. Review Connection Requests

## Connection Request API

- Created a dynamic route:

      POST /request/review/:status/:userId

### `$or` Query

- Used `$or` query:

      Model.find({
          $or: [
              { q: q },
              { q: q },
              { q: q }
          ]
      })

---

## POST vs GET Thought Process

- Learnt the thought process between `POST` and `GET`.

### POST

- We can't let attackers send malicious data.

### GET

- We can't let attackers fetch unnecessary data.

---

## Populate

- Learnt how to use `ref` and `populate`.
- Added the syntax to `syntax.md`.

---

## APIs Created

- `GET /user/receivedRequests`
- `GET /user/connections`

---

# 14. User Feed

## GET `/user/feed`

- Created `GET /user/feed`.

- Learnt:
    - `$and`
    - `$or`
    - `$nin`
    - `$ne`
    - Other MongoDB query operators.

### Pagination

- Implemented pagination using:

      .skip()
      .limit()

- Created a complete API like:

      GET /user/feed?page=2&limit=10

---

# Live Chat Feature Using Socket.IO

- Installed and configured the `socket.io` npm package in the backend.

- Implemented:
    - Event emitting.
    - Event handling logic.

- Created the Chat model.

- When the `messageSend` event is emitted:
    - The message is handled.
    - The chat is saved inside the database.

- Created:

      GET /chats/:receiverId

- This API gets all the chats of the user.

- The complete Socket.IO setup is inside:

      socketIo_setup_guide.md