import { generateToken } from "../config/utils.js";
import User from "../models/User.js"; 
import bcrypt from "bcryptjs"; 
import cloudinary from "../config/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: fullName,
      email,
      password: hashedPassword
    });

    generateToken(newUser.id, res);

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic,
      createdAt: newUser.createdAt
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login= async (req,res)=>{
    const { email,password }=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const user=await User.findOne({
      where: { email }
    });
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
       const isPasswordCorrect= await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        generateToken(user.id,res);
        res.status(200).json({
          id:user.id,
            name:user.name,
            email:user.email,
            profilePic:user.profilePic  
        })    
    }
    catch(error){
        console.log("Error in Logic Controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
    res.send("logout Page");
}

export const updateProfile =async(req,res)=>{
    try{
        const {profilePic}=req.body;
       const userId= req.user.id;
       if(!profilePic){
        return res.status(400).json({message:"Please provide a profile picture"});
       }
       const uploadResponse=await cloudinary.uploader.upload(profilePic);
       
       await User.update(
  { profilePic: uploadResponse.secure_url },
  { where: { id: userId } }
);

const updatedUser = await User.findByPk(userId, {
  attributes: { exclude: ["password"] }
});

res.status(200).json(updatedUser);

    }
    catch(error){
        console.log("Error in updateProfile controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}  

export const checkAuth=(req,res)=>{
try {
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }}