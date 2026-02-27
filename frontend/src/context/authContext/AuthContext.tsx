import { createContext, useMemo, useContext, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { type ReactNode } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  userName: string;
  email: string;
  bio: string;
  profilePicture: string;
}

interface AuthContextType {
  cookies: { [x: string]: any };
  user: User | null;
  login: (formData: Object) => Promise<void>;
  logout: () => void;
  signUp: (formData: Object) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: ContextProviderProps) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [user, setUser] = useState<User | null>(null);

  async function login(formData: Object): Promise<void> {
    let res = await axios.post("http://localhost:3000/api/auth/login", formData);
    setCookies("accessToken", res.data.accessToken);
    setUser(res.data.user);  // Store user data
  }

  async function signUp(formData: Object): Promise<void> {
    let res = await axios.post("http://localhost:3000/api/auth/register", formData);
    setCookies("accessToken", res.data.accessToken);
    setUser(res.data.user);  // Store user data
  }

  function logout() {
    removeCookies("accessToken");
    setUser(null);  // Clear user data
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}