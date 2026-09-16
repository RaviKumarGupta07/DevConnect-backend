const socket = require('socket.io');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { createHash } = require("./hashCreate");


const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.on('connection', (socket) => {
        socket.on("joinChat", ({ senderId, receiverId, senderName, token }) => {

            try {
                // create an unique room for both senders and receivers
                const roomId = [senderId, receiverId].sort().join("_");
                // for security hash this roomId

                const hashedRoomId = createHash(roomId);


                // validate token to verify senderId
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const { _id } = decoded;
                if (_id !== senderId) {
                    return;
                };

                // after validating user just 
                socket.join(hashedRoomId);
            } catch (err) {
                console.error("ERROR : " + err.message);
            }

        }),
            socket.on("sendMessage", ({ senderId, receiverId, message, senderName }) => {
                const roomId = [senderId, receiverId].sort().join("_");
                const hashedRoomId = createHash(roomId);
                io.to(hashedRoomId).emit("messageReceived", { senderId, senderName, message });
            }),
            socket.on("disconnect", () => { })
    });
}
module.exports = initializeSocket;