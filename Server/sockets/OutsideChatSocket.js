export const attachOutsideChatHandlers = (io, socket) => {
  const getRoom = (userId) => `userId-${userId}`;
  socket.on("join-outside-chat",({userId})=>{
 const roomName = getRoom(userId);
    socket.join(roomName);
    console.log(`👤 User ${userId} joined ${roomName}`);
  });
  
  socket.on("sendMessage",(data)=>{
    const receiverRoom=getRoom(data.receiverId);
    console.log("Emitting to room:", receiverRoom);
    socket.to(receiverRoom).emit("newMessage",data);
  });

socket.on("leave-chat-room", ({ userId }) => {
    socket.leave(getRoom(userId));
    console.log(`👤 User ${userId} left`);
  });



};