import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';

const roles = ['AFILIADO', 'EMPLEADO', 'ADMIN'];

type User = { id: number; nombre: string; apellido: string; email: string; role: string; dni: string };

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', dni: '', password: '', role: 'EMPLEADO' });

  const loadUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId: number, role: string) => {
    await api.patch(`/users/${userId}/role`, { role });
    loadUsers();
  };

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/users', form);
    setForm({ nombre: '', apellido: '', email: '', dni: '', password: '', role: 'EMPLEADO' });
    loadUsers();
  };

  return (
    <div className="space-y-8">
      <PageSection title="Usuarios" description="Control de roles y altas rápidas">
        <div className="overflow-auto rounded-2xl border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-light">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50">
                  <td className="p-3">{user.nombre} {user.apellido}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <select className="rounded-2xl border px-2 py-1" value={user.role} onChange={(e) => changeRole(user.id, e.target.value)}>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection title="Alta de empleado" description="Creá cuentas administrativas en segundos">
        <form onSubmit={createStaff} className="grid gap-4 md:grid-cols-3">
          {['nombre', 'apellido', 'dni', 'email', 'password'].map((field) => (
            <input
              key={field}
              className="rounded-2xl border px-4 py-2"
              placeholder={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <select className="rounded-2xl border px-4 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {['EMPLEADO', 'ADMIN'].map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <button className="rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-slate-900" type="submit">
            Crear empleado
          </button>
        </form>
      </PageSection>
    </div>
  );
}
