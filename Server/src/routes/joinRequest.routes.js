import express from 'express';
import {
    requestToJoin,
    getJoinRequests,
    acceptRequest,
    rejectRequest,
} from "../controllers/joinRequest.controllers.js";
import { protectRoute } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post("/request/:sessionId", protectRoute, requestToJoin);
router.get("/requests/:sessionId", protectRoute, getJoinRequests);
router.post("/accept/:requestId", protectRoute, acceptRequest);
router.post("/reject/:requestId", protectRoute, rejectRequest);

export default router;