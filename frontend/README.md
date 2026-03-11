# TradeCircle Frontend
React 18 + TypeScript web application for the TradeCircle skill-sharing platform.

## Other Repos
Main Repo: https://github.com/dylanlewis12/TradeCircle-Platform <br />
Frontend Repo: https://github.com/dylanlewis12/TradeCircle-Frontend <br />
Backend Repo: https://github.com/dylanlewis12/TradeCircle-Backend <br />

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Environment Setup

Create `.env` file:
```
API_BASE_URL=http://localhost:3000
```

## Project Structure

```
src/
├── pages/              # Home, Marketplace, Dashboard, Chat, AboutUs
├── components/         # Reusable components and modals
├── context/           # AuthContext for global auth state
├── styles/            # CSS files (BEM methodology)
├── config/            # API configuration
└── App.tsx            # Main app with routing
```

## Key Technologies

- **Framework:** React + TypeScript
- **State:** React Context (Auth) + Zustand (Chat)
- **HTTP:** Axios
- **Real-Time:** Socket.io Client
- **Routing:** React Router v6
- **Styling:** CSS with BEM

## Key Components

| Component | Purpose |
|-----------|---------|
| Marketplace.tsx | Browse skills |
| Dashboard.tsx | User dashboard with stats |
| TradeHistory.tsx | Manage trades |
| Chat.tsx | Real-time messaging |

## Authentication Flow

1. User logs in → JWT token stored in cookie
2. Token included in all API requests
3. Socket.io connects with authenticated user
4. Logout clears token and closes socket

## API Base URL

All requests use `API_BASE_URL` from `src/config/api.ts`

```typescript
// Example
const response = await axios.get(
  `${API_BASE_URL}/api/skills`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
```

## Notes

- Backend must be running on port 3000
- All API requests require JWT authentication
- Socket.io auto-connects after login
- Token expires in 1 hour (refresh handled automatically)

---

**See main README.md for full application overview**
