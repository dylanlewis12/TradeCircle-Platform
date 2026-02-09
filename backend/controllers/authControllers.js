import express from 'express';
import User from '../models/User.js';
import jwt from "jsonwebtoken";

// Registration
export const userRegistration = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        //Check all fields are field
        if(!userName || !email || !password) {
            return res.status(401).json({ message: "All fields are required" });
        }

        //Validate email format
        if(!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(404).json({ message: "User already exists" });
        }

        //Validate password format
         const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (password.length < 8 || !pattern.test(password)) {
            return res.status(401).json({ message: "Invalid password format" });
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validate email format
        if(!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password exists
        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        //Find user by email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "",
            { expiresIn: "1d" }
        );

        //Success response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const userLogout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const passwordReset = async (req, res) => {
    try {
        const { email, password } = req.body;

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}