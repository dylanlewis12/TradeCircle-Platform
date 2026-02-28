import { createContext, useMemo, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface User {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  totalTrades?: number;
}

interface AuthContextType {
  cookies: { [x: string]: any };
  user: User | null;
  login: (formData: Object) => Promise<void>;
  logout: () => void;
  signUp: (formData: Object) => Promise<void>;
}

// Create context with undefined default
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [user, setUser] = useState<User | null>(null);

  async function login(formData: Object): Promise<void> {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);
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

  function logout() {
    removeCookies("accessToken");
    setUser(null);
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

// Default export (for ContextProvider)
export default AuthProvider;