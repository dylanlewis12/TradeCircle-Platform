# TradeCircle

A community-driven skill-sharing platform that empowers users to exchange services and skills without monetary transactions.

## Features

* **Post Skills** - Share skills you can teach or services you can provide
* **Browse Community** - Discover skills available in your community
* **Search & Filter** - Find skills by category, proficiency level, and listing type
* **Skill Exchange** - Trade your skills with others in peer-to-peer transactions
* **Volunteer Services** - Offer your skills for free to help community members
* **Reputation System** - Build trust through ratings and reviews from completed trades
* **Direct Messaging** - Communicate with other users about trades and requests
* **Community Discovery** - Browse a feed of trending and random skills

## Tech Stack

Frontend:
* HTML
* CSS
* JavaScript
* Axios

Backend:
* Node.js
* Express.js
* MongoDB
* Mongoose 
* JWT Authentication

Data:
* MongoDB Atlas
* Bcryptjs for password hashing

## Installation

1. Clone the repository
```
git clone https://github.com/dmikelewis12/TradeCircle-Platform.git
cd TradeCircle-Platform/backend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the backend directory
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the server
```
npm run dev
```

The server will start on `http://localhost:3000`

## Project Structure
```
TradeCircle-Platform/
├── backend/
│   ├── server.js                   
│   ├── package.json
│   ├── .env                       
│   ├── models/
│   │   ├── User.js                  
│   │   ├── Skill.js                
│   │   ├── Trade.js                
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User profile logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── skillRoutes.js           # Skill endpoints
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
|   |   └── middlewares.js
│   ├── db/
│   │   └── conn.js                  # Database connection
│   └── controllers/
└── frontend/
```

## API Endpoints

### Authentication Routes

| Method | Route | Description | Authentication | CRUD |
|--------|-------|-------------|-----------------|------|
| POST | `/api/auth/register` | Register a new user account | No | CREATE |
| POST | `/api/auth/login` | Login with email and password | No | READ |
| POST | `/api/auth/logout` | Logout current user | Yes | DELETE |
| DELETE | `/api/auth/delete-account` | Delete user account and all data | Yes | DELETE |

### User Routes

| Method | Route | Description | 
|--------|-------|-------------|
| GET | `/api/users/profile` | Get authenticated user's profile |
| PUT | `/api/users/profile` | Update authenticated user's profile | 
| PUT | `/api/users/profile-picture` | Update user's profile picture | 
| GET | `/api/users/:id` | Get another user's public profile | 
| GET | `/api/users/:id/skills` | Get skills posted by user | 
| GET | `/api/users/:id/reviews` | Get reviews for a user |

### Skill Routes

| Method | Route | Description | 
|--------|-------|-------------|
| POST | `/api/skills` | Create a new skill listing | 
| GET | `/api/skills` | Get all active skill listings |
| GET | `/api/skills/search` | Search skills by name or category | 
| GET | `/api/skills/category/:category` | Get skills by category | 
| GET | `/api/skills/:id` | Get details of a specific skill | 
| PUT | `/api/skills/:id` | Update a skill listing | 
| DELETE | `/api/skills/:id` | Delete a skill listing | 
| GET | `/api/skills/trending` | Get trending skills | 

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

Tokens are issued upon successful login or registration and expire after 1 day.


## Author

Created by Dylan Lewis

Connect with me:
* GitHub: (https://github.com/dylanlewis12)
* LinkedIn: (https://linkedin.com/in/dylanlewis12)
