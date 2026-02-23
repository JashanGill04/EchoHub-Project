import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SessionParticipant = sequelize.define(
  "SessionParticipant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("HOST", "PARTICIPANT"),
      allowNull: false,
    },
  },
  {
    tableName: "session_participants",
    timestamps: true,
    indexes: [
      { fields: ["sessionId"] },
      { fields: ["userId"] },
    ],
  }
);

export default SessionParticipant;
