import express from "express";
import { protectRoute } from '../middlewares/auth.middlewares.js';
import { getUsersForSidebar,getmessages,sendmessage ,loadAllUsers} from '../controllers/message.controllers.js';
const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar)
router.get("/allusers",protectRoute,loadAllUsers);
router.get("/:id",protectRoute,getmessages);
router.post("/send/:id",protectRoute,sendmessage);





export default router;