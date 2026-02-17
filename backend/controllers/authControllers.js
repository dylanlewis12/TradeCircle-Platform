import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generateTokens from '../utils/tokenUtils.js';

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

        //Check email isn't already in use
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(404).json({ message: "Email already taken" });
        }

        const existingUser = await User.findOne({ userName });
        if(existingUser) {
            return res.status(404).json({ message: "Username already taken" });
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

        //Generaye JWT token
        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token in database
        await RefreshToken.create({ 
            token: refreshToken, 
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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

//Logout - revoke refresh token
export const userLogout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        if(refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }

        res.clearCookie('refreshToken');

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const tokenRefresh = async = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        // Verify token is still in DB (not revoked)
        
    }

}

//Delete a user
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
    await Skill.deleteMany({ userId });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Refresh cookie endpoint
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if(!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verufy(refreshToken, process.env.REFRESH_SECRET);
        const { accessToken } = generateTokens(decoded);
        res.json({ accessToken });
    } catch(error) {
       res.status(403).json({ message: 'Refresh token invalid or expired' }); 
    }
}