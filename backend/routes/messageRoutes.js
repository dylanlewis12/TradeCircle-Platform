import express from "express";
import { 
  getUsersforSidebar, 
  getMessages, 
  sendMessage,
  createOrGetConversation  
} from "../controllers/messageControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, getUsersforSidebar);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);
router.post("/create-or-get", protect, createOrGetConversation);  

export default router;