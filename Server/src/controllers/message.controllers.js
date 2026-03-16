import Message from "../models/Message.js";
import User from "../models/User.js";
import { Op } from "sequelize";

//get chat history
export const getmessages = async (req, res) => {
  const { id:friendId } = req.params;
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
        { model: User, as: "sender", attributes: ["name", "profilePic"] },
        { model: User, as: "receiver", attributes: ["name", "profilePic"] },
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
    const { id  } = req.params;
    const senderId = req.user.id;  
    let imageUrl;
       if(image){
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
       }

    const newMessage= await Message.create({
        senderId,
        receiverId : id,
        text,
        image: imageUrl,
    });
    
    res.status(201).json(newMessage);

    }
    catch(error){   
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsersForSidebar = async (req, res) => {
  const myId = req.user.id;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId },
          { receiverId: myId },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "profilePic"] },
        { model: User, as: "receiver", attributes: ["id", "name", "profilePic"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const usersMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId === myId ? msg.receiver : msg.sender;

      if (!usersMap.has(otherUser.id)) {
        usersMap.set(otherUser.id, otherUser);
      }
    });

    const users = Array.from(usersMap.values());

    res.status(200).json(users);

  } catch (error) {
    console.error("Error fetching sidebar users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loadAllUsers= async(req,res)=>{
  try{
       const users= await User.findAll({
         attributes:["id","name","profilePic"],
       });
       res.status(200).json(users);

  }catch(err){
    res.status(500).json({message:"Internal server error"});
  }
};
