import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../state/AuthContext';

export default function RegisterPage() {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/turnos');
    } catch (err) {
      setError((err as Error).message || 'No se pudo crear tu cuenta');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-10 rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-glow backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.5em] text-brand-primary">Registro</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Creá tu cuenta de afiliado</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Podrás reservar turnos, revisar tu historial y acceder a recordatorios en minutos.
            </p>
          </div>
          {['nombre', 'apellido', 'dni', 'email'].map((field) => (
            <div key={field}>
              <label className="text-sm capitalize text-slate-600 dark:text-slate-300">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                className="mt-1 w-full"
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600 dark:text-slate-300">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-rose-500 md:col-span-2">{error}</p>}
          <button className="btn-primary md:col-span-2" type="submit">
            Crear cuenta
          </button>
          <p className="md:col-span-2 text-center text-sm text-slate-500 dark:text-slate-300">
            ¿Ya tenés acceso?{' '}
            <Link to="/login" className="font-semibold text-brand-primary">
              Iniciá sesión
            </Link>
          </p>
        </form>
        <div className="flex flex-col justify-center space-y-4 rounded-3xl border border-white/40 p-6 text-sm text-slate-600 dark:border-slate-800/60 dark:text-slate-300">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Beneficios para afiliados</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Agenda inteligente con recordatorios automáticos.</li>
            <li>Historial actualizado y documentación centralizada.</li>
            <li>Alertas sobre turnos disponibles en tu sector favorito.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
