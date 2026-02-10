import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/User.js';

// Update pfp
export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.params.id;
        const { profilePicture } = req.body;

        if(!profilePicture) {
            return res.status(400).json({ message: "Unable to update profile picture, src is missing" });
        } 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePictire: profilePicture },
            { new: true } // Returns updated document
         ).select("-password"); //Exclude password field in returned updated document

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
        const userId = req.params.id;
        const { bio } = req.body;

        if(!bio) {
            return res.status(400).json({ message: "Unable to update profile picture, src is missing" });
        } 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bio: bio },
            { new: true } // Returns updated document
         ).select("-password"); //Exclude password field in returned updated document

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


// Get trading history
// Update bio
export const getTradeHistory = async (req, res) => {
    try {
        const userId = req.params.id;
        const { bio } = req.body;

        if(!bio) {
            return res.status(400).json({ message: "Unable to update profile picture, src is missing" });
        } 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bio: bio },
            { new: true } // Returns updated document
         ).select("-password"); //Exclude password field in returned updated document

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

// Get ratings

// Get profile could use index

// Get User

