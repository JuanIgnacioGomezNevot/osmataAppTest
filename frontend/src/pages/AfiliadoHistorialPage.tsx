import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';
import { StatusBadge } from '../components/StatusBadge';

export default function AfiliadoHistorialPage() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/appointments/my').then((res) => setAppointments(res.data));
  }, []);

  return (
    <PageSection title="Historial de turnos" description="Visualizá tus turnos realizados y cancelados">
      <div className="overflow-auto rounded-2xl border border-slate-100">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-light text-left">
            <tr>
              <th className="p-3 font-medium">Fecha</th>
              <th className="p-3 font-medium">Tipo</th>
              <th className="p-3 font-medium">Sector</th>
              <th className="p-3 font-medium">Profesional</th>
              <th className="p-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((turno) => (
              <tr key={turno.id} className="border-b border-slate-50">
                <td className="p-3">{new Date(turno.fechaHoraInicio).toLocaleString('es-AR')}</td>
                <td className="p-3">{turno.appointmentType?.nombre}</td>
                <td className="p-3">{turno.sector?.nombre}</td>
                <td className="p-3">
                  Dr/a {turno.doctor?.nombre} {turno.doctor?.apellido}
                </td>
                <td className="p-3">
                  <StatusBadge status={turno.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageSection>
  );
}
