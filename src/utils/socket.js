const socket = require('socket.io');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { createHash } = require("./hashCreate");
const Chat = require('../models/chat');


const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.on('connection', (socket) => {
        socket.on("joinChat", ({ senderId, receiverId, senderName, token }) => {

            try {
                // validate token to verify senderId
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const { _id } = decoded;
                if (_id !== senderId) {
                    return;
                };

                // create an unique room for both senders and receivers
                const roomId = [senderId, receiverId].sort().join("_");

                // for security hash this roomId
                const hashedRoomId = createHash(roomId);

                // after validating user just 
                socket.join(hashedRoomId);
            } catch (err) {
                console.error("ERROR : " + err.message);
            }

        }),
            socket.on("sendMessage", async ({ senderId, receiverId, message, senderName, token }) => {
                try {
                    // validate token to verify senderId
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const { _id } = decoded;
                    if (_id !== senderId) {
                        return;
                    };

                    const roomId = [senderId, receiverId].sort().join("_");
                    const hashedRoomId = createHash(roomId);

                    // save msg to database
                    // first find if any chat having these 2 id is present or not
                    let chat = await Chat.findOne({
                        participants: { $all: [senderId, receiverId] }
                    })

                    if (!chat) {
                        chat = new Chat({
                            participants: [senderId, receiverId],
                            messages: [
                                {
                                    text: message,
                                    senderId,
                                    senderName,
                                }
                            ]
                        })
                    } else {
                        chat.messages.push({
                            text: message,
                            senderId,
                            senderName,
                        })
                    }
                    await chat.save();

                    io.to(hashedRoomId).emit("messageReceived", { senderId, senderName, message });
                } catch (err) {
                    console.error("ERROR : ", err.message);
                }
            }),
            socket.on("disconnect", () => { })
    });
}
module.exports = initializeSocket;

// Chat: {
//     participants: [111, 112],
//         messages : [
//             {
//                 text: "hi bhai",
//                 senderId: "111",
//                 senderName: "Ravi"
//             },
//             {
//                 text: "hi bhai",
//                 senderId: "111",
//                 senderName: "Ravi"
//             }
//         ]
// }