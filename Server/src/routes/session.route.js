import express from "express";
import { protectRoute } from '../middlewares/auth.middlewares.js';
import { checkAuth } from '../controllers/auth.controllers.js';
import {createSessions,getAllSessions,getSessionById,leaveSession} from '../controllers/session.controllers.js';
const router=express.Router();


router.post("/",protectRoute, createSessions);
router.get("/",protectRoute, getAllSessions);
router.get("/:id",protectRoute, getSessionById);
router.post("/:sessionId/leaveSession",protectRoute,leaveSession);

export default router;