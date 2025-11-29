import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, ArrowRightOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuthContext } from '../state/AuthContext';
import { useTheme } from '../state/ThemeContext';

const navByRole = {
  AFILIADO: [
    { to: '/turnos', label: 'Turnos disponibles' },
    { to: '/historial', label: 'Historial' },
    { to: '/perfil', label: 'Mi perfil' },
  ],
  EMPLEADO: [
    { to: '/panel-turnos', label: 'Turnos' },
    { to: '/stock', label: 'Stock' },
    { to: '/perfil', label: 'Mi perfil' },
  ],
  ADMIN: [
    { to: '/panel-turnos', label: 'Turnos' },
    { to: '/stock', label: 'Stock' },
    { to: '/usuarios', label: 'Usuarios' },
    { to: '/configuracion', label: 'Configuración' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/perfil', label: 'Mi perfil' },
  ],
};

type Props = { children: React.ReactNode };

export function AppLayout({ children }: Props) {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  if (!user) return null;
  const navItems = navByRole[user.role];

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 transition dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/40 bg-white/80 p-4 shadow-glow backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-white/40 p-2 lg:hidden dark:border-slate-700" onClick={() => setOpen(!open)} aria-label="Abrir menú">
                <Bars3Icon className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-primary">OSMATA</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">Sanatorio San Cayetano</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={toggleTheme}
                className="rounded-full border border-white/30 p-2 text-slate-700 hover:bg-white/60 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <span className="text-slate-600 dark:text-slate-300">{user.nombre}</span>
              <span className="rounded-full bg-brand-primary/20 px-3 py-1 text-xs font-semibold text-brand-primary dark:bg-brand-primary/30 dark:text-white">
                {user.role}
              </span>
              <button onClick={logout} className="btn-ghost flex items-center gap-1">
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
          <nav
            className={`${open ? 'mt-4 flex' : 'hidden lg:mt-4 lg:flex'} flex-wrap gap-2 text-sm font-medium text-slate-700 dark:text-slate-100`}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3 py-1 transition ${
                    isActive
                      ? 'bg-brand-primary/90 text-white shadow-glow'
                      : 'bg-white/40 text-slate-600 hover:bg-white/80 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
