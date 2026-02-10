import express from "express";
import { userRegistration, userLogout, userLogin, deleteUser } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//User registration route
router.post("/register", userRegistration);

//User logout route
router.post("logout", userLogout);

//User login route
router.post("login", userLogin);

//Delete user route
router.delete("delete-account", protect, deleteUser);

export default router;