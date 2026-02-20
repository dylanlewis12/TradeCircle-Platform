import AuthProvider from "./authContext/AuthContext";
import { CookiesProvider } from "react-cookie";
import { type ReactNode } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ContextProviderProps){
    return (
        <CookiesProvider>
            <AuthProvider>{children}</AuthProvider>
        </CookiesProvider>

    );
}