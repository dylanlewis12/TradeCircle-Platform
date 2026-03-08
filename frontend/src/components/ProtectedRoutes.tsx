import { useAuth } from '../context/authContext/AuthContext.tsx';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedRoutes() {
  const { user, isLoggingIn } = useAuth();

  // Show loading while checking auth
  if (isLoggingIn) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}