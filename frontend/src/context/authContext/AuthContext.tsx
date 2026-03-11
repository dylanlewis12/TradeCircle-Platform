import { createContext, useMemo, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api.ts';
import { useChat } from '../../components/chat/store/useChat.tsx';

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
  setUser: (user: User | null) => void;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (formData: Object) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (formData: Object) => Promise<void>;
}

const BASE_URL = API_BASE_URL;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setAccessToken } = useChat();

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
        const restoredUser: User = {
          id: decoded.id,
          userName: decoded.userName || 'User',
          email: decoded.email,
          bio: decoded.bio || '',
          profilePicture: decoded.profilePicture || '',
          location: decoded.location || '',
          totalTrades: decoded.totalTrades || 0,
        };
        
        setUser(restoredUser);
        // Initialize socket with token
        setAccessToken(token);
        console.log('User restored from token');
      } catch (error) {
        console.error('Error restoring user from token:', error);
        removeCookies("accessToken");
      }
    };

    restoreUserFromToken();
  }, []);

  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      try {
        const token = cookies.accessToken;
        if (!token) {
          console.log('No token found');
          return;
        }

        const decoded: any = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        console.log('Token expires in:', Math.floor(timeUntilExpiry / 1000), 'seconds');

        if (timeUntilExpiry < 60000) {
          console.log('Token expired or expiring soon, logging out automatically');
          handleAutoLogout();
        }

      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 30000);
    return () => clearInterval(interval);
  }, [cookies.accessToken]);

  // Handle automatic logout
  const handleAutoLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
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
      removeCookies("accessToken");
      setUser(null);
      navigate('/');
    }
  };
  

  async function login(formData: Object): Promise<void> {
    setIsLoggingIn(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setCookies("accessToken", res.data.accessToken);
      setUser(res.data.user);
      
      // Initialize socket with token
      setAccessToken(res.data.accessToken, res.data.user.id);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function signUp(formData: Object): Promise<void> {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      setCookies("accessToken", res.data.accessToken);
      setUser(res.data.user);
      
      // Initialize socket with token
      setAccessToken(res.data.accessToken, res.data.user.id);
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    setIsLoggingOut(true);
    try {
      const token = cookies.accessToken;
      
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      removeCookies("accessToken");
      setUser(null);
      setIsLoggingOut(false);
    }
  }

  const value = useMemo(
    () => ({
      cookies,
      user,
      setUser,
      isLoggingIn,
      isLoggingOut,
      login,
      logout,
      signUp,
    }),
    [cookies, user, isLoggingIn, isLoggingOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;