import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';

export default function ConfiguracionPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [sectorForm, setSectorForm] = useState({ nombre: '', descripcion: '' });
  const [doctorForm, setDoctorForm] = useState({ nombre: '', apellido: '', matricula: '', email: '', especialidad: '', sectorId: '' });

  const loadData = async () => {
    const [secRes, docRes] = await Promise.all([api.get('/catalog/sectors'), api.get('/catalog/doctors')]);
    setSectors(secRes.data);
    setDoctors(docRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createSector = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/catalog/sectors', sectorForm);
    setSectorForm({ nombre: '', descripcion: '' });
    loadData();
  };

  const createDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/catalog/doctors', { ...doctorForm, sectorId: Number(doctorForm.sectorId) });
    setDoctorForm({ nombre: '', apellido: '', matricula: '', email: '', especialidad: '', sectorId: '' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <PageSection title="Sectores" description="Especialidades y espacios del sanatorio">
        <div className="grid gap-4 md:grid-cols-3">
          {sectors.map((sec) => (
            <div key={sec.id} className="rounded-3xl border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Sector</p>
              <p className="text-lg font-semibold text-slate-400">{sec.nombre}</p>
              <p className="text-xs text-slate-500">{sec.descripcion}</p>
            </div>
          ))}
        </div>
        <form onSubmit={createSector} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-2xl border px-4 py-2" placeholder="Nombre" value={sectorForm.nombre} onChange={(e) => setSectorForm({ ...sectorForm, nombre: e.target.value })} required />
          <input className="rounded-2xl border px-4 py-2" placeholder="Descripción" value={sectorForm.descripcion} onChange={(e) => setSectorForm({ ...sectorForm, descripcion: e.target.value })} />
          <button className="rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-slate-900" type="submit">
            Agregar sector
          </button>
        </form>
      </PageSection>

      <PageSection title="Doctores" description="Profesionales por sector">
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-3xl border border-slate-100 p-4">
              <p className="text-lg font-semibold text-slate-800">
                {doc.nombre} {doc.apellido}
              </p>
              <p className="text-sm text-slate-500">{doc.especialidad}</p>
              <p className="text-xs text-slate-500">Sector: {doc.sector?.nombre}</p>
            </div>
          ))}
        </div>
        <form onSubmit={createDoctor} className="mt-4 grid gap-3 md:grid-cols-3">
          {['nombre', 'apellido', 'matricula', 'email', 'especialidad'].map((field) => (
            <input
              key={field}
              className="rounded-2xl border px-4 py-2"
              placeholder={field}
              value={(doctorForm as any)[field]}
              onChange={(e) => setDoctorForm({ ...doctorForm, [field]: e.target.value })}
              required={field !== 'email'}
            />
          ))}
          <select className="rounded-2xl border px-4 py-2" value={doctorForm.sectorId} onChange={(e) => setDoctorForm({ ...doctorForm, sectorId: e.target.value })} required>
            <option value="">Sector</option>
            {sectors.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.nombre}
              </option>
            ))}
          </select>
          <button className="rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-slate-900" type="submit">
            Agregar doctor
          </button>
        </form>
      </PageSection>
    </div>
  );
}
