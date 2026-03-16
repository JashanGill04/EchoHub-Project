import {Server, Socket} from "socket.io";
import { attachWhiteboardHandlers } from "./whiteboardSocket.js";
import { attachOutsideChatHandlers } from "./OutsideChatSocket.js";
let io;
const userSocketMap = {};
export const initSocket = (httpServer)=>{
    io = new Server(httpServer,{
      cors: {
        origin: "http://localhost:5173",
        credentials:true,
      }
    }),


io.on("connection", (socket) => {  
  
  console.log("A User Connected:", socket.id);
  const userId=socket.handshake.auth.userId;
if(userId) userSocketMap[userId]=socket.id
io.emit("getOnlineUsers",Object.keys(userSocketMap));


  attachWhiteboardHandlers(io,socket);
  socket.on("join-session", ({ sessionId, userId }) => {
    const roomName = `session-${sessionId}`;
    socket.join(roomName);
    console.log(`👤 User ${userId} joined ${roomName}`);

    // Optional: Tell the room a new person joined
    // This helps the Host know when it's safe to start the call
    socket.to(roomName).emit("user-joined", { userId });
  });

  socket.on("webrtc-signal", ({ sessionId, data }) => {
    const roomName = `session-${sessionId}`;
    console.log(`📡 Relaying signal in ${roomName}`);
    
    // Broadcast to everyone else in the session
    socket.to(roomName).emit("webrtc-signal", { data });
    console.log({data});
  });
socket.on("chat:send", ({ sessionId, message }) => {
    // message = { text, senderId, senderName, createdAt }
    console.log("SERVER: chat:send received, broadcasting to room", sessionId, message);
        const roomName = `session-${sessionId}`;

    socket.to(roomName).emit("chat:receive", message);
  });

  socket.on("leave-session", ({ sessionId, userId }) => {
    socket.leave(`session-${sessionId}`);
    console.log(`👤 User ${userId} left`);
  });

  attachOutsideChatHandlers(io,socket);
  socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));


    });  

});



return io;
};

export const getIO= ()=> io; 