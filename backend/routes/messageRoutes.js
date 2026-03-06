import express from "express";
import { protect } from '../middleware/authMiddleware';
import {
    getUsersforSidebar,
    getMessages,
    sendMessage
} from '../controllers/messageControllers.js';

const router = express.Router();

router.get("/users", protect, getUsersforSidebar);
router.get("/:id",protect, getMessages);

router.post("/send/:id", protect, sendMessage)

export default router;