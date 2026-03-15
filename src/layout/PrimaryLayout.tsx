import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Wallet, HandCoins, Users } from 'lucide-react';
import { useAuthStore } from '../features/auth/auth.store';
import { Button } from '../components/ui/button';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/debts', label: 'Debts', icon: Wallet },
  { to: '/receivables', label: 'Receivables', icon: HandCoins },
  { to: '/contacts', label: 'Contacts', icon: Users },
];

const PrimaryLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            <p className="text-xl font-semibold text-slate-900">Debt & Receivable</p>
            <p className="text-sm text-slate-500">Manager</p>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-slate-100',
                      isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600',
                    )
                  }
                >
                  {({ isActive }: { isActive: boolean }) => (
                    <>
                      <Icon className={cn('h-4 w-4', isActive && 'text-white')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            {user && (
              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            )}
            <Button variant="ghost" className="w-full mt-3" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>
        <main className="flex-1">
          <header className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border-b border-slate-200 bg-white/70 backdrop-blur">
            <div>
              <p className="text-lg font-semibold text-slate-900">Debt & Receivable Manager</p>
              <p className="text-sm text-slate-500">Track what you owe and what others owe you.</p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden md:flex items-center gap-2">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              )}
              <Button variant="secondary" onClick={handleLogout} className="md:hidden">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </header>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrimaryLayout;
