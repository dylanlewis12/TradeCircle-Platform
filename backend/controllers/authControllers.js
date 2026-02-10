import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};