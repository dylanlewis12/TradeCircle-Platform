import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

// Update profile picture
export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profilePicture } = req.body;

        if(!profilePicture) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        } 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: profilePicture },
            { new: true }
         ).select("-password");

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update bio
export const updateBio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio } = req.body;

        if(!bio) {
            return res.status(400).json({ message: "Bio is required" }); // Fixed error message
        } 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bio: bio },
            { new: true }
         ).select("-password");

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "User bio updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all users
export const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).select("-password");

        if (allUsers.length === 0) {
            return res.status(200).json({ message: "No users found", users: [] }); // Changed 404 to 200
        }

        res.status(200).json({
            message: 'All users returned successfully',
            users: allUsers
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Get total trades of a user
export const getTotalTrades = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("userName email totalTrades rating");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User trades retrieved successfully", // Fixed message
            user: user
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a specific user
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User found successfully",
            user: user // Added user to response
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Get user rating
export const getUserRating = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("userName email rating totalTrades");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User rating returned successfully",
            user: user
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete all users 
export const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({}); 

        res.status(200).json({
            message: `${result.deletedCount} users deleted successfully`
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}