import Session from "../models/Session.js";
import User from "../models/User.js";
import SessionParticipant from "../models/SessionParticipant.js";
import { getIO } from "../../sockets/socket.js";
 
//create a new session

export const createSessions =async(req,res)=>{
 try{
      const { title} = req.body;
      const hostId=req.user.id;
     if(!title || title.trim()===""){
        return res.status(400).json({message:"session title is required"});  
     }
    const session=await Session.create({
        title,
        hostId,
    })
     
    await SessionParticipant.create({
      sessionId: session.id,
      userId: hostId,
      role: "HOST",
    });
    
    const io = getIO();

io.emit("session-created", {
  sessionId: session.id,
});

    res.status(201).json({
    message:"Session created successfully",
    session,
    });
 }catch(error){
    console.error("Error in createSessions controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
 }
};

export const getAllSessions=async(req,res)=>{
  try{
    
    const sessions=await Session.findAll({
        where:{isActive:true},
        include:[
        {
          model:User,
          as:"host",
          attributes:["id","name","email","profilePic"],
        },
    ],
    order: [["createdAt", "DESC"]],
});
    const cleanSessions = sessions.map((s) => s.toJSON());
    res.json(cleanSessions);


  }catch(error){
    console.error("Error in getAllSessions controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id, {
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "profilePic"],
        },
        {
          model: SessionParticipant,
          include: [
            {
              model: User,
              attributes: ["id", "name", "profilePic"],
            },
          ],
        },
      ],
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const leaveSession = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;
  const session = await Session.findByPk(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const io=getIO();
  // 🚨 HOST LEAVING = END SESSION
  if (session.hostId === userId) {
    // Option A: hard delete
    await Session.destroy({ where: { id: sessionId } });
    

       io.to(`session-${sessionId}`).emit("session-ended", {
      sessionId,
      message: "Host ended the session",
    });

io.emit("session-removed", {
  sessionId: session.id,
});
    return res.json({
      message: "Host left. Session ended.",
      sessionEnded: true,
    });
  }
  await SessionParticipant.destroy({
    where: {
      sessionId,
      userId,
    },
  });
    io.to(`session-${sessionId}`).emit("participant-left", {
    sessionId,
    userId,
  });
  
  return res.json({
    message: "Left session successfully",
    sessionEnded: false,
  });
};
