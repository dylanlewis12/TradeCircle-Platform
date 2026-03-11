# TradeCircle Frontend - Technical Documentation

Comprehensive documentation for the TradeCircle React + TypeScript frontend application. This guide covers architecture, component structure, state management, styling, and development practices.

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Architecture Overview](#architecture-overview)
3. [Directory Structure](#directory-structure)
4. [Components Guide](#components-guide)
5. [State Management](#state-management)
6. [Authentication Flow](#authentication-flow)
7. [Real-Time Messaging](#real-time-messaging)
8. [Styling Guide](#styling-guide)
9. [API Integration](#api-integration)
10. [Development Practices](#development-practices)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Project Setup

### Prerequisites
- Node.js 14+
- npm or yarn
- Backend running on http://localhost:3000

### Installation

```bash
# Clone repository
git clone https://github.com/dmikelewis12/TradeCircle-Frontend.git
cd TradeCircle-Platform/frontend

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Start development server
npm run dev
```

### Available Scripts

```bash
# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript
npm run lint
```

---

## 🏗️ Architecture Overview

### Frontend Stack

```
React 18 + TypeScript
│
├── State Management
│   ├── React Context
│   │   └── AuthContext (User, Cookies, Auth methods)
│   │
│   └── Zustand Store
│       └── useChat (Messages, Conversations, Users)
│
├── HTTP Client
│   └── Axios (With interceptors for auth)
│
├── Real-Time Communication
│   └── Socket.io Client
│       ├── User mapping
│       ├── Message events
│       └── Connection management
│
├── Routing
│   └── React Router v6
│       ├── Public routes
│       ├── Protected routes
│       └── Redirects on auth state
│
└── UI & Styling
    ├── Lucide React (Icons)
    ├── React Hot Toast (Notifications)
    └── CSS (BEM Methodology)
```

### Data Flow Architecture

```
User Action
    ↓
Component State Update
    ↓
API Call (Axios)
    ↓
Backend Processing
    ↓
Response Handler
    ↓
Update Global State (Context/Zustand)
    ↓
Re-render Components
```

---

## 📁 Directory Structure

### Complete Directory Tree

```
frontend/
├── public/
│   └── vite.svg
│
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Marketplace.tsx       # Skill browsing & search
│   │   ├── Dashboard.tsx         # User dashboard with stats
│   │   ├── Chat.tsx              # Messaging interface
│   │   └── AboutUs.tsx           # About page
│   │
│   ├── components/
│   │   ├── DashboardSkillCard.tsx        # Display user's skills
│   │   ├── MarketSkillCard.tsx           # Marketplace skill card
│   │   ├── TradeHistory.tsx              # Trade management UI
│   │   ├── Navbar.tsx                    # Navigation component
│   │   ├── Modal.tsx                     # Reusable modal wrapper
│   │   │
│   │   ├── chat/
│   │   │   ├── Chat.tsx                  # Chat page container
│   │   │   ├── ChatContainer.tsx         # Messages display
│   │   │   ├── ChatHeader.tsx            # Chat header with user info
│   │   │   ├── ConversationsSidebar.tsx # Conversation list
│   │   │   ├── MessageInput.tsx          # Message input form
│   │   │   ├── NoChatSelected.tsx        # Empty state
│   │   │   └── store/
│   │   │       └── useChat.tsx           # Zustand chat store
│   │   │
│   │   └── modals/
│   │       ├── RatingModal.tsx           # Trade rating interface
│   │       ├── UserModal.tsx             # View user profile
│   │       ├── CurrentUserModal.tsx      # Edit account modal
│   │       └── skills/
│   │           └── AddSkill.tsx          # Create skill modal
│   │
│   ├── context/
│   │   └── authContext/
│   │       └── AuthContext.tsx           # Auth state & methods
│   │
│   ├── styles/
│   │   ├── pages/
│   │   │   ├── Home.css
│   │   │   ├── Marketplace.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Chat.css
│   │   │   └── AboutUs.css
│   │   │
│   │   └── components/
│   │       ├── Navbar.css
│   │       ├── Modal.css
│   │       ├── TradeHistory.css
│   │       ├── ChatContainer.css
│   │       ├── MessageInput.css
│   │       ├── ConversationsSidebar.css
│   │       └── modals/
│   │           ├── RatingModal.css
│   │           ├── UserModal.css
│   │           └── CurrentUserModal.css
│   │
│   ├── config/
│   │   └── api.ts                        # API base URL configuration
│   │
│   ├── App.tsx                           # Main app component with routing
│   ├── App.css                           # Global styles
│   ├── index.css                         # Base styles
│   └── main.tsx                          # Entry point
│
├── .env                                  # Environment variables
├── .env.example                          # Example env file
├── index.html                            # HTML entry point
├── package.json
├── tsconfig.json                         # TypeScript configuration
├── vite.config.ts                        # Vite configuration
└── README.md
```

---

## 🧩 Components Guide

### Page Components

#### **Home.tsx** - Landing Page
```typescript
// Purpose: Landing page with platform overview
// Features:
// - Hero section
// - Feature highlights
// - Call-to-action buttons
// - Responsive design
```

#### **Marketplace.tsx** - Skill Discovery
```typescript
// Purpose: Browse and search all available skills
// Features:
// - Skill cards with filtering
// - Search by category, proficiency level
// - Multi-criteria filtering
// - User profile viewing
// - Skill contact seller functionality
```

#### **Dashboard.tsx** - User Dashboard
```typescript
// Purpose: User's personal dashboard with stats and management
// Features:
// - Statistics cards (skills, trades, ratings)
// - Skill management tab
// - Trade history tab
// - Analytics tab
// - Sidebar filters for skills
// - Add/edit/delete skills
```

#### **Chat.tsx** - Messaging
```typescript
// Purpose: Real-time messaging interface
// Features:
// - Conversation sidebar
// - Chat container with messages
// - Message input form
// - Socket.io integration
// - Real-time updates
```

#### **AboutUs.tsx** - About Page
```typescript
// Purpose: Information about TradeCircle
// Features:
// - Mission statement
// - How it works
// - Platform values
// - Contact information
```

### Feature Components

#### **MarketSkillCard.tsx** - Skill Card (Marketplace)
```typescript
interface MarketSkill {
  skill: {
    _id: string;
    name: string;
    description: string;
    category: string;
    proficiencyLevel: string;
    yearsOfExperience: number;
    hoursAvailable: number;
    userId: {
      _id: string;
      userName: string;
      rating: number;
      profilePicture?: string;
    };
  };
  handleView: () => void;
  onViewProfile: (userId: string) => void;
}

// Key Functions:
// - Display skill information
// - Show provider details
// - Contact seller button
// - View profile button
// - Create trade proposal
```

#### **DashboardSkillCard.tsx** - Skill Card (Dashboard)
```typescript
// Purpose: Display user's own skills with management options
// Features:
// - Edit skill button
// - Delete skill button
// - Display all skill details
// - Status indicator
// - Filter controls
```

#### **TradeHistory.tsx** - Trade Management
```typescript
// Purpose: Manage trades across different statuses
// Features:
// - Three tabs: incoming, outgoing, accepted
// - Accept/decline trades
// - Complete trades and rate
// - Star rating system
// - Written reviews
// - Trade filtering and display

// State:
const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'completed'>();
const [trades, setTrades] = useState<Trade[]>([]);
const [ratingModal, setRatingModal] = useState({...});
```

#### **Navbar.tsx** - Navigation
```typescript
// Purpose: Main navigation bar
// Features:
// - Logo and branding
// - Navigation links
// - User menu dropdown
// - Notifications icon
// - Messages icon
// - Mobile responsive menu
```

### Modal Components

#### **RatingModal.tsx** - Trade Rating
```typescript
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  userName: string;
}

// Features:
// - Star rating selector (1-5)
// - Review textarea (500 char max)
// - Submit/cancel buttons
// - Character counter
```

#### **UserModal.tsx** - View User Profile
```typescript
// Purpose: View other users' public profiles
// Features:
// - Profile picture display
// - Username
// - Location
// - Rating and trade count
// - Bio display
// - User stats

// Data Fetching:
// GET /api/users/:userId
```

#### **CurrentUserModal.tsx** - Edit Account
```typescript
// Purpose: Edit current user's profile
// Features:
// - Edit username
// - Edit bio
// - Edit location
// - Profile picture (read-only)
// - Email (disabled)
// - Save/cancel buttons

// API:
// PUT /api/users/:userId
```

#### **AddSkill.tsx** - Create Skill
```typescript
// Purpose: Create new skill listing
// Features:
// - Skill name input
// - Category dropdown
// - Description textarea
// - Proficiency level selector
// - Years of experience
// - Hours available per week
// - Save/cancel buttons

// API:
// POST /api/skills
```

### Chat Components

#### **Chat.tsx** - Chat Container
```typescript
// Purpose: Main chat page
// Features:
// - Load user's conversations
// - Select conversation
// - Display chat interface
// - Socket.io setup
```

#### **ChatContainer.tsx** - Message Display
```typescript
// Purpose: Display messages between two users
// Features:
// - Message list with scrolling
// - Message timestamps
// - Sent/received styling
// - Auto-scroll to newest message
// - Message loading state
```

#### **ChatHeader.tsx** - Chat Info & Actions
```typescript
// Purpose: Display chat header with user info
// Features:
// - Other user's name and avatar
// - Create trade proposal button
// - Back button
// - User profile quick view
```

#### **MessageInput.tsx** - Message Composer
```typescript
// Purpose: Input and send messages
// Features:
// - Text input
// - Send button
// - Enter to send
// - Empty state handling
// - Loading state
```

#### **ConversationsSidebar.tsx** - Conversation List
```typescript
// Purpose: List all user's conversations
// Features:
// - User list
// - Last message preview
// - Active conversation highlight
// - User avatars
// - Online status indicator
```

---

## 🔄 State Management

### React Context - Authentication

**Location:** `src/context/authContext/AuthContext.tsx`

```typescript
interface User {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  rating?: number;
  totalTrades?: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cookies: any;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  restoreTokenFromStorage: () => Promise<void>;
}
```

**Usage:**
```typescript
const { user, cookies, login, logout, setUser } = useAuth();
```

**Key Functions:**
- `login()` - Authenticate with email/password
- `signup()` - Register new account
- `logout()` - Clear auth state and tokens
- `setUser()` - Update user profile after changes
- `restoreTokenFromStorage()` - Load persisted session

### Zustand Store - Messaging

**Location:** `src/components/chat/store/useChat.tsx`

```typescript
interface ChatStore {
  // State
  accessToken: string;
  selectedUser: User | null;
  conversations: Conversation[];
  messages: Message[];
  users: User[];
  
  // Actions
  setAccessToken: (token: string) => void;
  setSelectedUser: (user: User) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  createOrGetConversation: (userId: string) => Promise<string>;
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
```

**Usage:**
```typescript
const { 
  messages, 
  selectedUser, 
  sendMessage, 
  getMessages 
} = useChat();
```

**Key Methods:**
- `setAccessToken()` - Set JWT token for API calls
- `getUsers()` - Fetch conversation list
- `getMessages()` - Fetch messages with specific user
- `createOrGetConversation()` - Initialize conversation
- `sendMessage()` - Send new message
- `subscribeToMessages()` - Listen for real-time updates

---

## 🔐 Authentication Flow

### Login Flow

```
1. User enters email/password
   ↓
2. Submit to /api/auth/login
   ↓
3. Backend returns:
   - accessToken (JWT)
   - user object
   ↓
4. Frontend stores:
   - Token in cookie (httpOnly)
   - User in AuthContext
   ↓
5. Socket.io connects with authenticated user
   ↓
6. Redirect to Dashboard
```

### Token Refresh Flow

```
1. Access token expires (1 hour)
   ↓
2. API request fails with 401
   ↓
3. Axios interceptor detects 401
   ↓
4. Call /api/auth/refresh
   ↓
5. Backend validates refresh token
   ↓
6. Returns new access token
   ↓
7. Retry original request
```

### Logout Flow

```
1. User clicks logout
   ↓
2. Call /api/auth/logout
   ↓
3. Backend deletes refresh token
   ↓
4. Clear cookies and AuthContext
   ↓
5. Disconnect Socket.io
   ↓
6. Redirect to login
```

### Session Restoration

```
1. App loads
   ↓
2. Check for existing token in cookies
   ↓
3. If token exists, restore from storage
   ↓
4. Verify token with /api/auth/me
   ↓
5. Set user in AuthContext
   ↓
6. Connect Socket.io
   ↓
7. Load user data
```

---

## 💬 Real-Time Messaging

### Socket.io Integration

**Location:** `src/context/authContext/AuthContext.tsx`

```typescript
// Connection setup
const socket = io(API_BASE_URL, {
  auth: {
    token: accessToken
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// User mapping
socket.on('userOnline', (data) => {
  // Server maps user ID to socket ID
});

// Message events
socket.on('receiveMessage', (message) => {
  // Update chat store
  addMessage(message);
});
```

### Message Flow

```
1. User types message
   ↓
2. Click send or press Enter
   ↓
3. sendMessage() called with text
   ↓
4. POST /api/messages/send/:receiverId
   ↓
5. Backend saves to MongoDB
   ↓
6. Emit Socket event to receiver
   ↓
7. Receiver's app gets real-time notification
   ↓
8. Messages re-render instantly
```

### Chat Store Updates

```typescript
const sendMessage = async (receiverId: string, text: string) => {
  // 1. Optimistic update
  const newMessage = { ... };
  setMessages([...messages, newMessage]);
  
  // 2. API call
  await axios.post(
    `${BASE_URL}/send/${receiverId}`,
    { text },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  // 3. Fetch updated messages
  await getMessages(receiverId);
};
```

---

## 🎨 Styling Guide

### BEM Methodology

TradeCircle uses BEM (Block Element Modifier) CSS naming convention:

```css
/* Block */
.trade-card { ... }

/* Element */
.trade-card__header { ... }
.trade-card__body { ... }
.trade-card__actions { ... }

/* Modifier */
.trade-card--completed { ... }
.trade-card__status--accepted { ... }
.trade-card__btn--accept { ... }
```

### CSS Organization

**pages/** - Page-level styles
```css
.dashboard { ... }
.marketplace { ... }
.chat { ... }
```

**components/** - Component styles
```css
.navbar { ... }
.skill-card { ... }
.modal { ... }
```

**Color Scheme**
```css
/* Primary green */
--primary: #169928;
--primary-light: #1a9b2a;
--primary-dark: #0f6b1f;

/* Grays */
--text-dark: #1a1a1a;
--text-light: #666666;
--bg-light: #f9f9f9;
--border: #e0e0e0;
```

### Responsive Design

```css
/* Mobile first approach */
.component { /* mobile styles */ }

@media (min-width: 768px) {
  .component { /* tablet styles */ }
}

@media (min-width: 1024px) {
  .component { /* desktop styles */ }
}
```

---

## 🌐 API Integration

### Axios Configuration

**Location:** `src/config/api.ts`

```typescript
const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000"
  : "/";

export default API_BASE_URL;
```

### Common API Calls

**Authentication**
```typescript
// Login
await axios.post(`${API_BASE_URL}/api/auth/login`, {
  email, password
});

// Logout
await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Skills**
```typescript
// Get user's skills
await axios.get(`${API_BASE_URL}/api/skills/user/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Create skill
await axios.post(`${API_BASE_URL}/api/skills`, skillData, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Update skill
await axios.put(`${API_BASE_URL}/api/skills/${skillId}`, updates, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Trades**
```typescript
// Get user's trades
await axios.get(`${API_BASE_URL}/api/trades`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Create trade
await axios.post(`${API_BASE_URL}/api/trades`, tradeData, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Rate trade
await axios.post(`${API_BASE_URL}/api/trades/${tradeId}/rate`, 
  { rating, review }, 
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

**Messages**
```typescript
// Get conversations
await axios.get(`${API_BASE_URL}/api/messages/users`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get messages with user
await axios.get(`${API_BASE_URL}/api/messages/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Send message
await axios.post(`${API_BASE_URL}/api/messages/send/${receiverId}`,
  { text },
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

---

## 👨‍💻 Development Practices

### TypeScript Usage

All components use TypeScript with proper interfaces:

```typescript
interface ComponentProps {
  onClose: () => void;
  isOpen: boolean;
  data: Trade;
}

export default function Component({ onClose, isOpen, data }: ComponentProps) {
  // ...
}
```

### Component Structure

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext/AuthContext';
import axios from 'axios';
import '../styles/components/Component.css';

interface ComponentProps {
  // Props interface
}

export default function Component(props: ComponentProps) {
  // 1. Hooks
  const { user, cookies } = useAuth();
  const [state, setState] = useState<Type>(initial);

  // 2. Effects
  useEffect(() => {
    // Setup
  }, []);

  // 3. Handlers
  const handleAction = async () => {
    // Logic
  };

  // 4. Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}
```

### Error Handling

```typescript
try {
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Success
} catch (error: any) {
  console.error('Error:', error);
  // Handle specific error codes
  if (error.response?.status === 401) {
    // Token expired
  } else if (error.response?.status === 404) {
    // Not found
  }
  // Show user-friendly message
  toast.error(error.response?.data?.message || 'Something went wrong');
}
```

### Notifications

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Profile updated successfully!');

// Error
toast.error('Failed to update profile');

// Loading
toast.loading('Saving...');

// Custom
toast((t) => (
  <div>Custom message</div>
), {
  duration: 4000
});
```

---

## 🔧 Troubleshooting

### Common Issues

**Token Not Persisting**
- Check if cookies are enabled in browser
- Verify `httpOnly` flag on backend
- Check browser DevTools → Application → Cookies

**Messages Not Updating Real-Time**
- Verify Socket.io connection in DevTools
- Check WebSocket status
- Ensure user is authenticated before message operations
- Check browser console for errors

**CORS Errors**
- Verify backend CORS configuration
- Check API_BASE_URL in .env
- Ensure credentials are included in requests

**User Profile Not Updating**
- Call `setUser()` after profile update
- Verify API response includes all fields
- Check if bio/location fields are being sent

**Chat Not Loading**
- Verify user is authenticated
- Check conversation ID in URL
- Ensure backend messages endpoint is working
- Check Socket.io connection status

### Debug Mode

Enable detailed logging:

```typescript
// In components
console.log('🔧 Debug:', variable);
console.log('🔧 State:', state);
console.log('🔧 API Response:', response.data);

// In .env
VITE_DEBUG=true
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**Last Updated:** March 10, 2026  
**Frontend Version:** 1.0.0