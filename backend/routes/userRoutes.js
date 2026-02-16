import express from "express";
//import User from "../models/User.js";
//import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import { 
    updateProfilePicture, 
    updateBio, 
    getUsers, 
    getUser, 
    getUserRating, 
    getTotalTrades, 
    deleteAllUsers 
} from '../controllers/userController.js';

const router = express.Router();


router.put("/profile-picture", protect, updateProfilePicture);
router.put("/bio", protect, updateBio);
router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/:id/rating", getUserRating);
router.get("/:id/total-trades", getTotalTrades);
router.delete("/", deleteAllUsers); 

export default router;