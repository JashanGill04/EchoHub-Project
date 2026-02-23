
import sequelize from "../config/database.js";
import User from"./User.js";
import Session from "./Session.js";
import SessionParticipant from "./SessionParticipant.js";
import JoinRequest from "./JoinRequest.js";
import Message from "./Message.js";

/* User ↔ Session (host) */
User.hasMany(Session, { foreignKey: "hostId" });
Session.belongsTo(User, { foreignKey: "hostId", as: "host" });

/* Session Participants */
Session.hasMany(SessionParticipant, { foreignKey: "sessionId" });
SessionParticipant.belongsTo(Session, { foreignKey: "sessionId" });

User.hasMany(SessionParticipant, { foreignKey: "userId" });
SessionParticipant.belongsTo(User, { foreignKey: "userId" });

/* Join Requests */
Session.hasMany(JoinRequest, { foreignKey: "sessionId" });
JoinRequest.belongsTo(Session, { foreignKey: "sessionId" });

User.hasMany(JoinRequest, { foreignKey: "userId" });
JoinRequest.belongsTo(User, { foreignKey: "userId" });

/* Messages*/
// The Sender Relationship
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

// The Receiver Relationship
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

export default {
  sequelize,
  User,
  Session,
  SessionParticipant,
  JoinRequest,
  Message,
};
