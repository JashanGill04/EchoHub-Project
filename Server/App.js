import express from "express";
import dotenv  from "dotenv";
import sequelize  from "./src/config/database.js";
import db from "./src/models/index.js";
import cors from "cors";
import cookieParser  from "cookie-parser" ;
import authRoutes from "./src/routes/auth.route.js";
import sessionRoutes from "./src/routes/session.route.js";
import joinRequestRoutes from "./src/routes/joinRequest.routes.js";
// import  messageRoutes = from("./routes/message.route.js");
import http from "http";
import { initSocket } from "./sockets/socket.js";







const PORT = process.env.PORT;



const app = express();
app.use(express.json()); 
app.use(cookieParser());
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


//routes
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/join-requests",joinRequestRoutes );
// app.use("/api/messages", messageRoutes);






const server= http.createServer(app);
initSocket(server);



db.sequelize.sync()
  .then(() => console.log("✅ Models synced"))
  .catch(console.error);

  server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});