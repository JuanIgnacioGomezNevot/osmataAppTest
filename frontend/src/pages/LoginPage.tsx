import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../state/AuthContext';

export default function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'No se pudo iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-emerald-500/30 bg-white/95 p-8 text-emerald-950 shadow-2xl">
        <div className="space-y-3 text-center">
          <img
            src="/imagen_2025-11-29_142422227.png"
            alt="OSMATA"
            className="mx-auto h-16 w-16"
          />
          <p className="text-xs uppercase tracking-[0.6em] text-emerald-600">Obra social</p>
          <h1 className="text-4xl font-semibold text-emerald-900">OSMATA</h1>
          <p className="text-sm text-emerald-800/70">Ingresá para gestionar turnos y servicios</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-emerald-900">Correo electrónico</label>
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-emerald-900">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div className="mt-2 text-right text-xs">
              <Link to="/recuperar" className="font-semibold text-emerald-600 hover:text-emerald-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
          >
            Ingresar
          </button>
          <p className="text-center text-sm text-emerald-800/80">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Registrate como afiliado
            </Link>
          </p>
        </form>
        <div className="mt-6 rounded-2xl border border-emerald-100/80 bg-emerald-50/60 p-4 text-center text-xs text-emerald-700">
          <p className="font-semibold text-emerald-900">Demo:</p>
          <p><strong>Admin</strong> · admin@osmata.com / Cambio123</p>
          <p><strong>Empleado</strong> · empleado@osmata.com / Cambio123</p>
          <p><strong>Afiliado</strong> · afiliado@osmata.com / Cambio123</p>
        </div>
      </div>
    </div>
  );
}
