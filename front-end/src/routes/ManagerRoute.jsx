import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../lib/constants.js';
import { useAuthStore } from '../store/authStore.js';

export function ManagerRoute() {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== ROLES.manager) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
