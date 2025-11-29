import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('El enlace no es válido. Pedí uno nuevo.');
      return;
    }
    if (passwords.password !== passwords.confirm) {
      setMessage('Las contraseñas deben coincidir.');
      return;
    }
    setStatus('loading');
    try {
      await api.post('/auth/password/reset', { token, password: passwords.password });
      setStatus('done');
      setMessage('Tu contraseña fue actualizada. Ya podés iniciar sesión.');
    } catch (error: any) {
      setStatus('idle');
      setMessage(error?.response?.data?.message || 'No pudimos actualizar la contraseña.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-glow backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.5em] text-brand-primary">Crear una clave nueva</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Ingresá tu nueva contraseña</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Nueva contraseña</label>
            <input
              type="password"
              className="mt-1 w-full"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Confirmar contraseña</label>
            <input
              type="password"
              className="mt-1 w-full"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
              minLength={6}
            />
          </div>
          {message && (
            <p className={`text-sm ${status === 'done' ? 'text-emerald-500' : 'text-rose-500'}`}>{message}</p>
          )}
          <button className="btn-primary w-full" type="submit" disabled={status === 'loading' || !token}>
            {status === 'loading' ? 'Actualizando...' : 'Guardar contraseña'}
          </button>
          {!token && (
            <p className="text-center text-sm text-rose-500">
              El enlace ya no es válido. Volvé a solicitar uno nuevo.
            </p>
          )}
          <p className="text-center text-sm text-slate-500 dark:text-slate-300">
            <Link to="/login" className="font-semibold text-brand-primary">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
