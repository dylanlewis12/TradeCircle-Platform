import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Registration
export const userRegistration = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            return res.status(404).json({ message: "User already exists" });
        }

        //Validate email format
        if() {

        }

        //Create new user
        const newUser = new User({
            userName,
            email,
            password: 
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}