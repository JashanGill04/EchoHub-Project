import JoinRequest from "../models/JoinRequest.js";
import Session from "../models/Session.js";
import SessionParticipant from "../models/SessionParticipant.js";
import { getIO } from "../../sockets/socket.js";

// ===============================
// USER REQUESTS TO JOIN
// ===============================
export const requestToJoin = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;

  const session = await Session.findByPk(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (session.hostId === userId) {
    return res.status(400).json({ message: "You are the host" });
  }

  // Prevent duplicate requests
  const existing = await JoinRequest.findOne({
    where: { sessionId, userId },
  });

  if (existing) {
    return res.status(400).json({ message: "Request already sent" });
  }

  const request = await JoinRequest.create({
    sessionId,
    userId,
    status: "PENDING",
  });

  const io = getIO();
  io.to(`session-${sessionId}`).emit("join-request-created", {
    sessionId,
  });

  res.status(201).json({
    message: "Join request sent successfully",
    request,
  });
};

// ===============================
// HOST GETS JOIN REQUESTS
// ===============================
export const getJoinRequests = async (req, res) => {
  const { sessionId } = req.params;

  const requests = await JoinRequest.findAll({
    where: { sessionId, status: "PENDING" },
    include: ["User"],
  });

  res.json(requests);
};

// ===============================
// ACCEPT REQUEST
// ===============================
export const acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  const request = await JoinRequest.findByPk(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  const session = await Session.findByPk(request.sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  // Safety check
  if (session.hostId === request.userId) {
    return res.status(400).json({
      message: "Host cannot be added as participant",
    });
  }

  // Add participant if not exists
  const exists = await SessionParticipant.findOne({
    where: {
      sessionId: request.sessionId,
      userId: request.userId,
    },
  });

  if (!exists) {
    await SessionParticipant.create({
      sessionId: request.sessionId,
      userId: request.userId,
      role: "PARTICIPANT",
    });
  }

  // 🔥 DELETE join request (VERY IMPORTANT)
  await request.destroy();

  const io = getIO();
  

  // Notify waiting user
  io.to(`session-${request.sessionId}`).emit("join-request-approved", {
    userId: request.userId,
  });
  
  // Refresh host request list
  io.to(`session-${request.sessionId}`).emit("join-request-updated", {
    sessionId: request.sessionId,
  });
  
  io.to(`session-${request.sessionId}`).emit("participant-joined", {
  sessionId: request.sessionId,
  userId: request.userId,
});


  res.json({ message: "Request accepted" });
};

// ===============================
// REJECT REQUEST
// ===============================
export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  const request = await JoinRequest.findByPk(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  await request.destroy(); // 🔥 delete instead of reject

  const io = getIO();
  io.to(`session-${request.sessionId}`).emit("join-request-updated", {
    sessionId: request.sessionId,
  });

  res.json({ message: "Request rejected" });
};
