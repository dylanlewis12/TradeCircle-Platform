# TradeCircle Backend
Node.js + Express API for the TradeCircle skill-sharing platform.


## Other Repositories
Main Repository: https://github.com/dylanlewis12/TradeCircle-Platform <br />
Frontend Repository: https://github.com/dylanlewis12/TradeCircle-Frontend <br />
BackendRepository: https://github.com/dylanlewis12/TradeCircle-Backend <br />


## Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

Server runs on `http://localhost:3000`

## Environment Setup

Create `.env` file with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TradeCircle
ACCESS_SECRET=your_access_secret_key
REFRESH_SECRET=your_refresh_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
├── models/         # Mongoose schemas (User, Skill, Trade, Message, etc)
├── controllers/    # Business logic for each route
├── routes/         # API endpoints
├── middleware/     # Auth validation, error handling
├── utils/          # JWT token generation
├── lib/            # Socket.io configuration
├── db/             # Database connection
└── server.js       # Express app setup
```

## Key Technologies

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcryptjs
- **Real-Time:** Socket.io
- **Image Storage:** Cloudinary

## Main API Routes

| Endpoint | Purpose |
|----------|---------|
| `/api/auth/*` | Register, login, logout |
| `/api/users/:id` | Get/update user profile |
| `/api/skills` | CRUD skills |
| `/api/trades` | Manage trades |
| `/api/messages` | Send/get messages |

## Authentication

- **Access Token:** 1 hour expiration
- **Refresh Token:** 1 hour expiration (stored in httpOnly cookie)
- **Protected Routes:** Require JWT in Authorization header

```
Authorization: Bearer <access_token>
```

## Database Models

| Model | Purpose |
|-------|---------|
| User | User accounts, profiles, ratings |
| Skill | Skills users offer/request |
| Trade | Skill exchange transactions |
| Message | Direct messages between users |
| Conversation | Message thread metadata |
| RefreshToken | Session management |

## Socket.io Events

- `userOnline` - User connects
- `sendMessage` - Send message (auto-broadcast)
- `disconnect` - User disconnects

Real-time messages delivered automatically via WebSocket.

## Available Scripts

```bash
npm run dev     # Start with auto-reload
npm start       # Start server
```

## Notes

- MongoDB connection required
- Frontend runs on port 5173
- CORS configured for frontend origin
- Password: min 8 chars, 1 letter, 1 number, 1 special char

---

**See main README.md for full application overview**
