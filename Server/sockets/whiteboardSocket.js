const whiteboardHistory = new Map();

export const attachWhiteboardHandlers = (io, socket) => {

  const getRoom = (sessionId) => `session-${sessionId}`;

  // 🔁 history request (late joiners)
  socket.on("whiteboard:history-request", ({ sessionId }) => {
    const hist = whiteboardHistory.get(sessionId) || [];
    socket.emit("whiteboard:history", { strokes: hist });
  });


  // 🟢 stroke start
  socket.on("whiteboard:stroke:start", ({ sessionId, stroke }) => {
    const room = getRoom(sessionId);

    socket.to(room).emit("whiteboard:stroke:start", { stroke });

    if (!whiteboardHistory.has(sessionId)) {
      whiteboardHistory.set(sessionId, []);
    }

    whiteboardHistory.get(sessionId).push(stroke);
  });

  // 🟡 stroke move
  socket.on("whiteboard:stroke:move", ({ sessionId, strokeId, point }) => {
    const room = getRoom(sessionId);

    socket.to(room).emit("whiteboard:stroke:move", { strokeId, point });

    const hist = whiteboardHistory.get(sessionId);
    if (!hist) return;

    const stroke = hist.find((s) => s.id === strokeId);
    if (stroke) stroke.points.push(point);
  });

  // 🔴 stroke end
  socket.on("whiteboard:stroke:end", ({ sessionId, strokeId }) => {
    const room = getRoom(sessionId);

    socket.to(room).emit("whiteboard:stroke:end", { strokeId });
  });

  // 🧹 clear board
  socket.on("whiteboard:clear", ({ sessionId }) => {
    const room = getRoom(sessionId);

    whiteboardHistory.set(sessionId, []);
    io.in(room).emit("whiteboard:clear");
  });

  // 📐 resize board
  socket.on("whiteboard:resize", ({ sessionId, width, height }) => {
    const room = getRoom(sessionId);

    io.in(room).emit("whiteboard:resize", { width, height });
  });

// Inside attachWhiteboardHandlers
socket.on("whiteboard:viewport-sync", ({ sessionId, scrollLeft, scrollTop }) => {
  const room = getRoom(sessionId);
  // Broadcast to everyone else so their screen follows the host
  socket.to(room).emit("whiteboard:viewport-sync", { scrollLeft, scrollTop });
});


  // 🧨 session end cleanup
  socket.on("session-ended", ({ sessionId }) => {
    const room = getRoom(sessionId);

    whiteboardHistory.delete(sessionId);
    io.in(room).emit("whiteboard:clear");
  });
};
