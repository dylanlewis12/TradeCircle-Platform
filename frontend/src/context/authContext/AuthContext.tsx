import { createContext, useMemo, useContext } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { type ReactNode } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

interface AuthContextType {
    cookies: { [x: string]: any};
    login: (formData: Object) => Promise<void>;
    logout: () => void;
    signUp: (formData: Object) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: ContextProviderProps) {
    const [cookies, setCookies, removeCookies] = useCookies();

    async function login(formData: Object): Promise<void>{
        let res = await axios.post("http://localhost:3000/api/auth/login", formData);

        setCookies("token", res.data.token);
    }

    async function signUp(formData: Object): Promise<void> {
        let res = await axios.post("http://localhost:3000/api/auth/register", formData);

        setCookies("token", res.data.token);
    }

    function logout() {
        ["token"].forEach((token) => removeCookies(token)); //remove data save in cookies
    }

    // Use memo, stores a value from computationally functions and will not rerun those functions as long as the value doesnt change
    // As long as cookies doesnt change, we dont need to rerun any of these functions
    const value = useMemo(
        () => ({
            cookies,
            login,
            logout,
            signUp,
        }),
        [cookies],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Optional cheeky function to prevent excessive imports
// Otherwise
// import {useContext} from 'react';
// import {AuthContext} from '';
export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}