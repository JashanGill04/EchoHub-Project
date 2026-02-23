import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const  Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowCollaboration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // future whiteboard collab
    },
  },
  {
    tableName: "sessions",
    timestamps: true,
    indexes: [
      { fields: ["hostId"] },
      { fields: ["isActive"] },
    ],
  }
);

export default Session;
