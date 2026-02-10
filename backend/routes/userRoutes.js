import express from "express";
//import User from "../models/User.js";
//import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";
import { updateProfile, updateBio } from '../controllers/userController.js';

const router = express.Router();


router.put("/pfp", updateProfile);
router.put("/bio", updateBio);

export default router;