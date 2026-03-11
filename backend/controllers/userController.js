import express from 'express';
import User from '../models/User.js';
import Trades from '../models/Trades.js';

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

//Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { profilePicture, userName, bio, location } = req.body;

    if (!userName) {
      return res.status(400).json({ message: "Username is a required field" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture,
        userName,
        bio,
        location,
        updatedAt: Date.now()
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

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

    // Calculate total trades 
    const totalTrades = await Trades.countDocuments({
      $or: [
        { initiator: userId },  
        { receiver: userId }    
      ],
      status: "completed"
    });

    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        ...user.toObject(),
        totalTrades,
        rating: user.rating 
      }
    });
  } catch(error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select("userName email rating totalTrades profilePicture");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all completed trades where user is either initiator or receiver
    const trades = await Trades.find({
      $or: [
        { initiator: userId },
        { receiver: userId }
      ],
      status: "completed"
    }).select("initiator receiver initiatorRating receiverRating"); 

    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;

    trades.forEach(trade => {
      // If user is the initiator, they received receiverRating
      if (trade.initiator.toString() === userId && trade.receiverRating) {
        totalRating += trade.receiverRating;
        ratingCount++;
      }
      // If user is the receiver, they received initiatorRating
      if (trade.receiver.toString() === userId && trade.initiatorRating) {
        totalRating += trade.initiatorRating;
        ratingCount++;
      }
    });

    // Calculate average (or 0 if no ratings yet)
    const averageRating = ratingCount > 0 ? parseFloat((totalRating / ratingCount).toFixed(1)) : 0;

    res.status(200).json({
      message: "User rating retrieved successfully",
      user: {
        ...user.toObject(),
        averageRating,
        totalRatings: ratingCount
      }
    });
  } catch (error) {
    console.error("Error getting user rating:", error);
    res.status(500).json({ message: error.message });
  }
};

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
