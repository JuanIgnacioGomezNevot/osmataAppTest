import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/auth/password/forgot', { email });
      setStatus('sent');
      setMessage('Si el correo existe en el sistema, enviamos las instrucciones a tu bandeja de entrada.');
    } catch (error: any) {
      setStatus('idle');
      setMessage(error?.response?.data?.message || 'Ocurrió un problema. Intentá nuevamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-glow backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.5em] text-brand-primary">Recuperar acceso</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Restablecé tu contraseña</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Ingresá el correo con el que te registraste para recibir un enlace temporal.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Correo electrónico</label>
            <input type="email" className="mt-1 w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {message && <p className={`text-sm ${status === 'sent' ? 'text-emerald-500' : 'text-rose-500'}`}>{message}</p>}
          <button className="btn-primary w-full" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-300">
            <Link to="/login" className="font-semibold text-brand-primary">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
