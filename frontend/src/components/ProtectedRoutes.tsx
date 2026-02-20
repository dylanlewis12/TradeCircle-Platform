import { useAuth } from '../context/authContext/AuthContext.tsx';
import { Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
    const { cookies } = useAuth();

    return cookies.token ? <Outlet /> : <h1>You are not authorized</h1>;
}