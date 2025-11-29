import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import api from '../services/api';
import { PageSection } from '../components/PageSection';

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    const { data } = await api.get('/users/me');
    setProfile(data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    await api.put('/users/me', profile);
    setSaving(false);
  };

  const tiempoActivo = useMemo(() => {
    if (!profile?.fechaAltaObraSocial) return '';
    const inicio = dayjs(profile.fechaAltaObraSocial);
    const diffYears = dayjs().diff(inicio, 'year');
    const diffMonths = dayjs().diff(inicio.add(diffYears, 'year'), 'month');
    return `${diffYears} años y ${diffMonths} meses`;
  }, [profile]);

  if (!profile) return <p>Cargando perfil...</p>;

  return (
    <PageSection title="Mi perfil" description="Actualizá tus datos personales">
      <div className="grid gap-4 md:grid-cols-2">
        {['nombre', 'apellido', 'dni', 'email', 'direccion', 'ciudad', 'nacionalidad'].map((field) => (
          <div key={field}>
            <label className="text-sm text-slate-500 capitalize">{field}</label>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2"
              value={profile[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              disabled={field === 'dni' || field === 'email'}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-brand-light px-4 py-3 text-sm text-slate-600">
        Miembro activo desde {dayjs(profile.fechaAltaObraSocial).format('DD/MM/YYYY')} ({tiempoActivo})
      </div>
      <button
        onClick={saveProfile}
        className="mt-4 rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-slate-900"
        disabled={saving}
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </PageSection>
  );
}
