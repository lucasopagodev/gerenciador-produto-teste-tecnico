import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { DashboardPage } from '../features/products/pages/DashboardPage.jsx';
import { ProductDetailsPage } from '../features/products/pages/ProductDetailsPage.jsx';
import { NotFoundPage } from '../features/products/pages/NotFoundPage.jsx';
import { UsersPage } from '../features/users/pages/UsersPage.jsx';
import { ManagerRoute } from './ManagerRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route element={<ManagerRoute />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
