import { createContext, useMemo, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  totalTrades?: number;
  location?: string;
}

interface AuthContextType {
  cookies: { [x: string]: any };
  user: User | null;
  login: (formData: Object) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (formData: Object) => Promise<void>;
}

// Create context with undefined default
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();  // ✅ Add this
  const [cookies, setCookies, removeCookies] = useCookies();
  const [user, setUser] = useState<User | null>(null);

  // Restore user from token on app mount
  useEffect(() => {
    const restoreUserFromToken = () => {
      try {
        const token = cookies.accessToken;
        if (!token) {
          console.log('No token found on mount');
          return;
        }

        const decoded: any = jwtDecode(token);
        
        // Check if token is expired
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        if (expirationTime < currentTime) {
          console.log('Token expired on mount');
          removeCookies("accessToken");
          return;
        }

        // Restore user from token
        setUser({
          id: decoded.id,
          userName: decoded.userName || 'User',
          email: decoded.email,
          bio: decoded.bio || '',
          profilePicture: decoded.profilePicture || '',
          location: decoded.location || '',
          totalTrades: decoded.totalTrades || 0,
        });

        console.log('User restored from token');
      } catch (error) {
        console.error('Error restoring user from token:', error);
        removeCookies("accessToken");
      }
    };

    restoreUserFromToken();
  }, []); // Only run once on mount


  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      try {
        const token = cookies.accessToken;
        if (!token) {
          console.log('No token found');
          return;
        }

        // Decode the token to get expiration time
        const decoded: any = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        console.log('Token expires in:', Math.floor(timeUntilExpiry / 1000), 'seconds');

        // If token is expired or will expire in less than 1 minute
        if (timeUntilExpiry < 60000) {
          console.log('Token expired or expiring soon, logging out automatically');
          handleAutoLogout();

        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    // Check immediately on mount
    checkTokenExpiration();

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [cookies.accessToken]);

  
  // Handle automatic logout
  const handleAutoLogout = async () => {
    try {
      // Try to call backend logout
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Auto logout API call failed:', error);
    } finally {
      // Clear local state regardless of API response
      removeCookies("accessToken");
      setUser(null);
      navigate('/');
    }
  };

  async function login(formData: Object): Promise<void> {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setCookies("accessToken", res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function signUp(formData: Object): Promise<void> {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", formData);
      setCookies("accessToken", res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      const token = cookies.accessToken;  // Get access token from cookies
      
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch(error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
    } finally {
      removeCookies("accessToken");
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      cookies,
      user,
      login,
      logout,
      signUp,
    }),
    [cookies, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;