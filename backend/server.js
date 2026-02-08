import express from 'express';
import { logReq, globalErr } from './middleware/middlewares.js';
// Route Imports
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import staticRoutes from './routes/staticRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import dotenv from "dotenv";

// Setups
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;


// Middlewares
app.use(express.json());
app.use(logReq);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/static", staticRoutes);
app.use("/api/trades", tradeRoutes);

// Global Err Middlewares
app.use(globalErr);

// Listener
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});