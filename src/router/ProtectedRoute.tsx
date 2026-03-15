import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth.store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
