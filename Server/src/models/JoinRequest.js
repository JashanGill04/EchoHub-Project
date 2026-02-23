import { DataTypes } from "sequelize";
import  sequelize from "../config/database.js";

const JoinRequest = sequelize.define(
  "JoinRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "join_requests",
    timestamps: true,
    indexes: [
      { fields: ["sessionId"] },
      { fields: ["userId"] },
      { fields: ["status"] },
    ],
  }
);

export default JoinRequest;
