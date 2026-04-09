import { ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import { Badge } from '@radix-ui/themes';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROLE_LABELS, ROLES } from '../../lib/constants.js';
import { useAuthStore } from '../../store/authStore.js';
import { AppButton } from '../ui/AppButton.jsx';

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isManager = user?.role === ROLES.manager;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="bg-white/80 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.3)] backdrop-blur">
        <div className="app-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-slate-950"
            >
              Gerenciador de Produtos
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`
                }
              >
                Dashboard
              </NavLink>
              {isManager ? (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`
                  }
                >
                  Usuários
                </NavLink>
              ) : null}
            </nav>

            <div className="flex w-full flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.16)] sm:w-auto sm:flex-row sm:items-center sm:rounded-xl sm:py-2">
              <PersonIcon className="h-4 w-4 text-slate-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user?.fullName}
                  </p>
                  <Badge
                    color={user?.role === 'Manager' ? 'gray' : 'gray'}
                    size="2"
                  >
                    {ROLE_LABELS[user?.role] ?? ROLE_LABELS[ROLES.user]}
                  </Badge>
                </div>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <AppButton
                className="!w-full !justify-center sm:!w-auto"
                tone="secondary"
                onClick={handleLogout}
              >
                <ExitIcon />
                Sair
              </AppButton>
            </div>
          </div>
        </div>
      </header>

      <main className="app-container py-8">
        <Outlet />
      </main>
    </div>
  );
}
