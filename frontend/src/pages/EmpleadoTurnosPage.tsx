import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';
import { StatusBadge } from '../components/StatusBadge';

type User = { id: number; nombre: string; apellido: string; role: string; dni: string };

const slotDefaults = () => ({
  sectorId: '',
  doctorId: '',
  appointmentTypeId: '',
  fecha: '',
  hora: '',
  duracion: 30,
  requiereEstudios: false,
  comentarios: '',
});

const assignDefaults = () => ({ appointmentId: null, afiliadoId: '', resumen: '' });

export default function EmpleadoTurnosPage() {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [filters, setFilters] = useState({ fecha: '', sectorId: '', estado: '' });
  const [sectors, setSectors] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [afiliados, setAfiliados] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [newSlot, setNewSlot] = useState(slotDefaults);
  const [assignForm, setAssignForm] = useState(assignDefaults);

  const fetchTurnos = async () => {
    const { data } = await api.get('/appointments', {
      params: {
        ...(filters.fecha ? { fecha: filters.fecha } : {}),
        ...(filters.sectorId ? { sectorId: Number(filters.sectorId) } : {}),
        ...(filters.estado ? { estado: filters.estado } : {}),
      },
    });
    setTurnos(data);
  };

  const fetchCatalogs = async () => {
    const [sectorRes, doctorRes, typeRes, usersRes] = await Promise.all([
      api.get('/catalog/sectors'),
      api.get('/catalog/doctors'),
      api.get('/catalog/appointment-types'),
      api.get('/users'),
    ]);
    setSectors(sectorRes.data);
    setDoctors(doctorRes.data);
    setAppointmentTypes(typeRes.data);
    setAfiliados(usersRes.data.filter((user: User) => user.role === 'AFILIADO'));
  };

  useEffect(() => {
    fetchTurnos();
    fetchCatalogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 4000);
  };

  const runWithFeedback = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      notify(successMessage);
      fetchTurnos();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || 'Ocurrió un error. Intentá nuevamente.';
      notify(apiMessage);
    }
  };

  const createSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.fecha || !newSlot.hora) {
      notify('Completá la fecha y hora del turno.');
      return;
    }
    const start = new Date(`${newSlot.fecha}T${newSlot.hora}`);
    const end = new Date(start.getTime() + Number(newSlot.duracion || 30) * 60000);

    await runWithFeedback(
      () =>
        api.post('/appointments', {
          sectorId: Number(newSlot.sectorId),
          doctorId: Number(newSlot.doctorId),
          appointmentTypeId: Number(newSlot.appointmentTypeId),
          fechaHoraInicio: start.toISOString(),
          fechaHoraFin: end.toISOString(),
          requiereEstudiosComplementarios: newSlot.requiereEstudios,
          comentarios: newSlot.comentarios || undefined,
        }),
      'Turno creado correctamente.'
    );
    setNewSlot(slotDefaults());
  };

  const deleteSlot = async (id: number) => {
    await runWithFeedback(() => api.delete(`/appointments/${id}`), 'Turno eliminado.');
    if (assignForm.appointmentId === id) {
      setAssignForm(assignDefaults());
    }
  };

  const cancelSlot = async (id: number) => {
    await runWithFeedback(() => api.post(`/appointments/${id}/cancel`), 'Turno liberado.');
  };

  const reserveForAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.appointmentId || !assignForm.afiliadoId) {
      notify('Seleccioná un turno y un afiliado.');
      return;
    }
    await runWithFeedback(
      () => api.post(`/appointments/${assignForm.appointmentId}/reserve`, { afiliadoId: Number(assignForm.afiliadoId) }),
      'Turno asignado al afiliado.'
    );
    setAssignForm(assignDefaults());
  };

  const selectableStatus = ['DISPONIBLE', 'RESERVADO', 'CANCELADO', 'COMPLETADO'];

  return (
    <div className="space-y-8">
      <PageSection
        title="Gestión de turnos"
        description="Seguimiento y acciones rápidas por sector, doctor y estado"
        actions={
          <div className="flex flex-wrap gap-2">
            <input type="date" value={filters.fecha} onChange={(e) => setFilters({ ...filters, fecha: e.target.value })} />
            <select value={filters.sectorId} onChange={(e) => setFilters({ ...filters, sectorId: e.target.value })}>
              <option value="">Todos</option>
              {sectors.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.nombre}
                </option>
              ))}
            </select>
            <select value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}>
              <option value="">Estado</option>
              {selectableStatus.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={fetchTurnos}>
              Aplicar filtros
            </button>
          </div>
        }
      >
        {message && <p className="mb-3 text-sm text-brand-primary dark:text-brand-accent">{message}</p>}
        <div className="overflow-auto rounded-2xl border border-white/30">
          <table className="min-w-full text-sm">
            <thead className="bg-white/60 text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:bg-slate-900/30 dark:text-slate-400">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Afiliado</th>
                <th className="p-3">DNI</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Profesional</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => {
                const date = new Date(turno.fechaHoraInicio);
                const disponible = turno.estado === 'DISPONIBLE';
                const reservado = turno.estado === 'RESERVADO';
                return (
                  <tr key={turno.id} className="border-b border-white/20 dark:border-slate-800/50">
                    <td className="p-3">{date.toLocaleString('es-AR')}</td>
                    <td className="p-3">{turno.afiliado ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}` : '-'}</td>
                    <td className="p-3">{turno.afiliado?.dni || '-'}</td>
                    <td className="p-3">{turno.sector?.nombre}</td>
                    <td className="p-3">Dr/a {turno.doctor?.nombre} {turno.doctor?.apellido}</td>
                    <td className="p-3">
                      <StatusBadge status={turno.estado} />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn-primary px-3 py-1 text-xs"
                          type="button"
                          disabled={!disponible}
                          onClick={() =>
                            setAssignForm({
                              appointmentId: turno.id,
                              afiliadoId: '',
                              resumen: `${turno.sector?.nombre || ''} • ${date.toLocaleString('es-AR')}`,
                            })
                          }
                        >
                          Reservar
                        </button>
                        <button
                          className="btn-ghost px-3 py-1 text-xs"
                          type="button"
                          disabled={!disponible}
                          onClick={() => deleteSlot(turno.id)}
                        >
                          Dar de baja
                        </button>
                        <button
                          className="btn-ghost px-3 py-1 text-xs"
                          type="button"
                          disabled={!reservado}
                          onClick={() => cancelSlot(turno.id)}
                        >
                          Liberar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <PageSection title="Crear turno manual" description="Armá disponibilidad adicional para cubrir la demanda">
          <form onSubmit={createSlot} className="grid gap-4">
            <select value={newSlot.sectorId} onChange={(e) => setNewSlot({ ...newSlot, sectorId: e.target.value })} required>
              <option value="">Sector</option>
              {sectors.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.nombre}
                </option>
              ))}
            </select>
            <select value={newSlot.doctorId} onChange={(e) => setNewSlot({ ...newSlot, doctorId: e.target.value })} required>
              <option value="">Doctor/a</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre} {doc.apellido}
                </option>
              ))}
            </select>
            <select value={newSlot.appointmentTypeId} onChange={(e) => setNewSlot({ ...newSlot, appointmentTypeId: e.target.value })} required>
              <option value="">Tipo de turno</option>
              {appointmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nombre}
                </option>
              ))}
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="date" value={newSlot.fecha} onChange={(e) => setNewSlot({ ...newSlot, fecha: e.target.value })} required />
              <input type="time" value={newSlot.hora} onChange={(e) => setNewSlot({ ...newSlot, hora: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                min={10}
                value={newSlot.duracion}
                onChange={(e) => setNewSlot({ ...newSlot, duracion: Number(e.target.value) })}
                placeholder="Duración (min)"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={newSlot.requiereEstudios}
                  onChange={(e) => setNewSlot({ ...newSlot, requiereEstudios: e.target.checked })}
                />
                Requiere estudios
              </label>
            </div>
            <textarea
              rows={2}
              placeholder="Notas internas (opcional)"
              value={newSlot.comentarios}
              onChange={(e) => setNewSlot({ ...newSlot, comentarios: e.target.value })}
            />
            <button className="btn-primary" type="submit">
              Crear turno
            </button>
          </form>
        </PageSection>

        <PageSection
          title="Reservar para un afiliado"
          description="Seleccioná el turno desde la tabla y asignalo en segundos"
        >
          <form onSubmit={reserveForAffiliate} className="space-y-4">
            <div className="rounded-2xl border border-dashed border-brand-primary/50 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
              {assignForm.appointmentId ? (
                <p>
                  Turno seleccionado: <span className="font-semibold">{assignForm.resumen}</span>
                </p>
              ) : (
                <p>Elegí un turno disponible desde la tabla para poder asignarlo.</p>
              )}
            </div>
            <select
              value={assignForm.afiliadoId}
              onChange={(e) => setAssignForm({ ...assignForm, afiliadoId: e.target.value })}
              disabled={!assignForm.appointmentId}
            >
              <option value="">Seleccionar afiliado</option>
              {afiliados.map((afiliado) => (
                <option key={afiliado.id} value={afiliado.id}>
                  {afiliado.nombre} {afiliado.apellido} · {afiliado.dni}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" type="submit" disabled={!assignForm.appointmentId}>
                Reservar turno
              </button>
              <button
                className="btn-ghost flex-1"
                type="button"
                onClick={() => setAssignForm(assignDefaults())}
              >
                Limpiar
              </button>
            </div>
          </form>
        </PageSection>
      </div>
    </div>
  );
}
