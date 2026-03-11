import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generateTokens from '../utils/tokenUtils.js';
import dotenv from 'dotenv';

dotenv.config();

// User Registration
// User Registration
export const userRegistration = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check all fields are filled
        if(!userName || !email || !password) {
            return res.status(401).json({ message: "All fields are required" });
        }

        // Validate email format
        if(!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check email isn't already in use
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(404).json({ message: "Email already taken" });
        }

        const existingUser = await User.findOne({ userName });
        if(existingUser) {
            return res.status(404).json({ message: "Username already taken" });
        }

        // Validate password format
        const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (password.length < 8 || !pattern.test(password)) {
            return res.status(401).json({ message: "Invalid password format" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // ✅ Generate tokens and return user data
        const { accessToken, refreshToken } = generateTokens(newUser);

        // Store refresh token
        await RefreshToken.findOneAndUpdate(
          { userId: newUser._id },
          { 
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          { upsert: true, new: true }
        );

        // Store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ 
            message: "User created successfully",
            accessToken: accessToken,
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                bio: newUser.bio,
                location: newUser.location,
                rating: newUser.rating
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

// User Login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt with email:', email);
        
        // Validate email format
        if(!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        
        // Validate password exists
        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Generate JWT token
        const { accessToken, refreshToken } = generateTokens(user);
        
        // Store refresh token in database
        await RefreshToken.findOneAndUpdate(
          { userId: user._id },
          { 
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          { upsert: true, new: true }
        );
        
        // Store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        //Success response with all user fields
        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                profilePicture: user.profilePicture,  
                bio: user.bio,                       
                location: user.location,             
                rating: user.rating                 
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// User Logout
export const userLogout = async (req, res) => {
  const { refreshToken } = req.cookies;
  
  console.log('Logout called');
  console.log('Refresh token present:', Boolean(refreshToken));

  try {
    if(refreshToken) {
      // Delete the refresh token from database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Token Refresh
export const tokenRefresh = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        // Verify token is still in DB (not revoked)
        const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
        if (!tokenRecord) return res.status(403).json({ message: 'Token revoked' });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const { accessToken } = generateTokens(decoded);
        res.json({ accessToken });
    } catch (err) {
        console.error('Token refresh error:', err);
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(userId);
    // Also delete user's skills if you have a Skill model
    // await Skill.deleteMany({ userId });
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};