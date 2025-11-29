import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';
import { StatusBadge } from '../components/StatusBadge';

export default function AfiliadoTurnosPage() {
  const [available, setAvailable] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [filters, setFilters] = useState({ sectorId: '', fecha: '' });
  const [loading, setLoading] = useState(false);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [loadingMyAppointments, setLoadingMyAppointments] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAvailable = async () => {
    setLoading(true);
    const { data } = await api.get('/appointments/available', {
      params: {
        ...(filters.sectorId ? { sectorId: Number(filters.sectorId) } : {}),
        ...(filters.fecha ? { fecha: filters.fecha } : {}),
      },
    });
    setAvailable(data);
    setLoading(false);
  };

  const fetchMyAppointments = async () => {
    setLoadingMyAppointments(true);
    const { data } = await api.get('/appointments/my');
    setMyAppointments(data);
    setLoadingMyAppointments(false);
  };

  useEffect(() => {
    api.get('/catalog/sectors').then((res) => setSectors(res.data));
  }, []);

  useEffect(() => {
    fetchAvailable();
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reserve = async (id: number) => {
    try {
      await api.post(`/appointments/${id}/reserve`);
      setMessage('Turno reservado con éxito. Te enviamos un correo con la confirmación.');
      fetchAvailable();
      fetchMyAppointments();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.message || 'No se pudo reservar';
      setMessage(apiMessage);
    }
  };

  const cancelReservation = async (id: number) => {
    try {
      await api.post(`/appointments/${id}/cancel`);
      setMessage('Cancelaste el turno. Ya está disponible para otros afiliados.');
      fetchAvailable();
      fetchMyAppointments();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.message || 'No se pudo cancelar el turno';
      setMessage(apiMessage);
    }
  };

  return (
    <div className="space-y-8">
      <PageSection
        title="Turnos disponibles"
        description="Elegí el sector y reservá en segundos"
        actions={
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.sectorId}
              onChange={(e) => setFilters({ ...filters, sectorId: e.target.value })}
            >
              <option value="">Todos los sectores</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.nombre}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.fecha}
              onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
            />
            <button className="btn-primary" onClick={fetchAvailable}>
              Buscar
            </button>
          </div>
        }
      >
        {message && <p className="mb-4 text-sm text-brand-primary dark:text-brand-accent">{message}</p>}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {available.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.sector.nombre}</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {new Date(item.fechaHoraInicio).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <StatusBadge status={item.estado} />
                </div>
                <p className="text-sm text-slate-500">Dr/a {item.doctor.nombre} {item.doctor.apellido}</p>
                {item.requiereEstudiosComplementarios && (
                  <p className="text-xs text-amber-600">Requiere estudios complementarios</p>
                )}
                <button className="btn-primary mt-3 w-full text-center" onClick={() => reserve(item.id)}>
                  Reservar turno
                </button>
              </div>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        title="Mis turnos reservados"
        description="Revisá tus próximas visitas y liberá un turno si no podés asistir"
      >
        {loadingMyAppointments ? (
          <p>Cargando...</p>
        ) : myAppointments.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no tenés turnos reservados.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myAppointments.map((item) => {
              const date = new Date(item.fechaHoraInicio);
              const isPast = date < new Date();
              return (
                <div key={item.id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{item.sector.nombre}</p>
                      <p className="text-lg font-semibold text-slate-800">{date.toLocaleString('es-AR')}</p>
                    </div>
                    <StatusBadge status={item.estado} />
                  </div>
                  <p className="text-sm text-slate-500">Dr/a {item.doctor.nombre} {item.doctor.apellido}</p>
                  {item.comentarios && <p className="text-xs text-slate-500">Notas: {item.comentarios}</p>}
                  <button
                    className={`btn-ghost mt-3 w-full justify-center ${isPast ? 'opacity-60' : ''}`}
                    onClick={() => cancelReservation(item.id)}
                    disabled={isPast}
                  >
                    {isPast ? 'Turno pasado' : 'Cancelar turno'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
