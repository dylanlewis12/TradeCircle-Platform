# TradeCircle - Community Skill Sharing Platform

A modern, full-stack web application that empowers communities to exchange skills and services without monetary transactions. TradeCircle connects people who want to learn new skills with experts willing to share their knowledge, fostering community collaboration and mutual growth.

## 🚀 Quick Overview

**What is TradeCircle?**
TradeCircle is a peer-to-peer skill exchange platform where users can post skills they want to teach or services they want to provide, browse available skills in their community, initiate trades, and build a reputation through ratings and reviews. Whether you want to trade web development for graphic design or volunteer your skills to help others, TradeCircle makes it easy.

**Repository:** https://github.com/dylanlewis12/TradeCircle-Platform
**Frontend Repository:** https://github.com/dylanlewis12/TradeCircle-Frontend
**BackendRepository:** https://github.com/dylanlewis12/TradeCircle-Backend

---

## ✨ Core Features

### 🔐 Authentication & User Management
- User registration with secure password hashing (bcryptjs)
- Email/password login with JWT authentication
- Persistent sessions with refresh tokens
- Complete user profile management
- Auto-logout on token expiration
- Account deletion with password verification

### 🎯 Skill Management
- Create, read, update, and delete skill listings
- 13+ skill categories (Technology, Language, Arts & Design, Business, etc.)
- Proficiency levels (Beginner, Intermediate, Advanced, Expert)
- Years of experience and hours available tracking
- Filter and search by category, level, and status
- Active/inactive/archived skill status management

### 🛍️ Marketplace Discovery
- Browse all available skills with advanced filtering
- Search by name, category, and proficiency level
- View user profiles directly from skill cards
- See skill provider ratings and trade history
- Multi-criteria filtering
- Skill cards with complete information

### 🤝 Trading System
- **Exchange Trades:** Mutual skill exchanges between users
- **Volunteer Offers:** Free services for community members
- Full trade lifecycle (pending → accepted → completed → rated)
- Trade negotiation via integrated messaging
- Automatic conversation creation
- Complete trade history tracking

### 💬 Real-Time Messaging
- Direct messaging using Socket.io
- Real-time message delivery
- Conversation history persistence
- Online/offline status tracking
- Integration with trade proposals
- Message notifications

### ⭐ Reputation & Rating System
- 1-5 star rating system
- Written reviews for qualitative feedback
- Average rating calculation
- Ratings visible on user profiles
- Trade-specific ratings
- Community trust building

### 📊 Dashboard & Analytics
- Personal statistics dashboard
- Skills count and active listings
- Completed trades count
- User rating display
- Trade history with filtering
- Skill management interface
- Accept/decline/complete trade actions

### 👥 User Profiles
- Public user profile viewing
- Profile information display
- Profile picture support
- Skill listings per user
- Quick messaging access
- Reputation display

---

## 🛠️ Technology Stack

### Frontend
```
React 18 + TypeScript
├── State Management
│   ├── React Context (Authentication)
│   └── Zustand (Messaging)
├── Networking
│   ├── Axios (HTTP)
│   └── Socket.io Client (Real-time)
├── UI & Styling
│   ├── Lucide React (Icons)
│   ├── React Hot Toast (Notifications)
│   └── CSS (BEM methodology)
├── Routing
│   └── React Router v6
└── Build
    └── Vite
```

### Backend
```
Node.js + Express.js
├── Database
│   ├── MongoDB (Atlas)
│   └── Mongoose 
├── Authentication
│   ├── JWT 
│   ├── bcryptjs 
│   └── Custom middleware
├── Real-Time
│   └── Socket.io
├── Storage
│   └── Cloudinary (Images)
└── Tools
    ├── dotenv (Config)
    ├── CORS (Cross-origin)
    └── Cookie Parser
```
---

### Directory Structure
```
TradeCircle-Platform/
├── frontend/
│   ├── src/
│   │   ├── pages/              # Full-page components
│   │   ├── components/         # Reusable components
│   │   ├── context/            # Global state (Auth)
│   │   ├── styles/             # CSS files (BEM)
│   │   ├── config/             # Configuration
│   │   └── App.tsx
│   ├── .env
│   └── package.json
│
└── backend/
    ├── models/                 # Mongoose schemas
    ├── controllers/            # Business logic
    ├── routes/                 # API endpoints
    ├── middleware/             # Auth & error handling
    ├── utils/                  # Helper functions
    ├── lib/                    # Socket.io config
    ├── db/                     # Database connection
    ├── server.js               # Entry point
    ├── .env
    └── package.json
```
---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB Atlas account
- Git

### Quick Start (5 minutes)

**1. Clone Repository**
```bash
git clone https://github.com/dylanlewis12/TradeCircle-Platform.git
cd TradeCircle-Platform
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
# Server runs on http://localhost:3000
```

**3. Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Full Setup Instructions
See `backend/README.md` and `frontend/README.md` for detailed setup instructions.

---

## 📡 API Overview

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |
| POST | `/auth/refresh` | Refresh token |

### User Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/:id` | Get user profile |
| PUT | `/users/:id` | Update profile |
| GET | `/users/:id/rating` | Get user rating details |

### Skill Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/skills` | Create skill |
| GET | `/skills` | Get all skills |
| GET | `/skills/user/:id` | Get user's skills |
| PUT | `/skills/:id` | Update skill |
| DELETE | `/skills/:id` | Delete skill |

### Trade Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/trades` | Create trade |
| GET | `/trades` | Get user's trades |
| PUT | `/trades/:id/accept` | Accept trade |
| PUT | `/trades/:id/complete` | Complete trade |
| POST | `/trades/:id/rate` | Rate trade |
| GET | `/trades/history/user` | Get trade history |

### Message Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/messages/users` | Get conversations |
| GET | `/messages/:id` | Get messages with user |
| POST | `/messages/send/:id` | Send message |
| POST | `/messages/create-or-get` | Create/get conversation |

**Full API documentation available in `BACKEND_README.md`**

---

## 🗄️ Database Models

### User Model
```javascript
{
  userName: String (unique),
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  bio: String,
  location: String,
  rating: Number (0-5),
  createdAt: Date,
  updatedAt: Date,
  isAdmin: Boolean
}
```

### Skill Model
```javascript
{
  userId: ObjectId (User),
  name: String,
  description: String,
  category: String,
  proficiencyLevel: String,
  yearsOfExperience: Number,
  hoursAvailable: Number,
  status: String,
  listingType: String
}
```

### Trade Model
```javascript
{
  initiator: ObjectId (User),
  receiver: ObjectId (User),
  skillOffering: ObjectId (Skill),
  skillExchange: ObjectId (Skill),
  transactionType: String,
  status: String,
  initiatorRating: Number,
  receiverRating: Number,
  initiatorReview: String,
  receiverReview: String
}
```

### Message Model
```javascript
{
  conversationId: ObjectId,
  senderId: ObjectId (User),
  receiverId: ObjectId (User),
  text: String,
  image: String,
  createdAt: Date
}
```

**Detailed schema information in `BACKEND_README.md`**

---
## 💻 Development Workflow

### Local Development
1. Start MongoDB connection (Atlas or local)
2. Start backend server on port 3000
3. Start frontend development server on port 5173
4. Open browser to http://localhost:5173

```

### Code Quality
- Frontend uses TypeScript for type safety
- Backend uses consistent error handling
- Both use ESM modules
- BEM naming for CSS classes

---

## 🔐 Security Features

✅ **Authentication**
- JWT tokens with 1-hour expiration
- Refresh tokens with persistent storage
- httpOnly, secure cookies

✅ **Password Security**
- bcryptjs hashing (10 salt rounds)
- Required validation patterns
- Password verification for critical actions

✅ **Authorization**
- Middleware-based route protection
- User ID verification in requests
- Role-based access (admin flag)

✅ **API Security**
- CORS enabled for trusted origins
- Request validation
- Error message sanitization

---

## 👤 Author

**Dylan Lewis**
- GitHub: [dylanlewis12](https://github.com/dylanlewis12)
- LinkedIn: [dylanlewis12](https://linkedin.com/in/dylanlewis12)
