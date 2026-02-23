import Message from "../models/Message.js";
import User from "../models/User.js";
import { Op } from "sequelize";

//get chat history
export const getmessages = async (req, res) => {
  const { friendId } = req.params;
  const myId = req.user.id;
  try {
   
    
    const chatHistory = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: friendId },
          { senderId: friendId, receiverId: myId },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["username", "profilePic"] },
        { model: User, as: "receiver", attributes: ["username", "profilePic"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//send Message
export const sendmessage = async (req, res) => {
    
    try{
       const { text, image } = req.body;
    const { friendId: receiverId } = req.params;
    const senderId = req.user.id;  
    let imageUrl;
       if(image){
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
       }

    const newMesssage= await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    
    res.status(201).json("message sent successfully");

    }
    catch(error){   
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsersForSidebar = async (req, res) => {
    const myId= req.user.id;
      try {
    const Messagedusers = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: friendId },
          { senderId: friendId, receiverId: myId },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["username", "profilePic"] },
        { model: User, as: "receiver", attributes: ["username", "profilePic"] },
      ],
      order: [["createdAt", "ASC"]],
    });
}catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};
