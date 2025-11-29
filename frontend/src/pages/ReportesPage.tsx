import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';

export default function ReportesPage() {
  const [filtro, setFiltro] = useState({ desde: new Date().toISOString().slice(0, 10), hasta: new Date().toISOString().slice(0, 10) });
  const [turnos, setTurnos] = useState<any[]>([]);
  const [stockCritico, setStockCritico] = useState<any[]>([]);

  const loadReports = async () => {
    const [turnosRes, stockRes] = await Promise.all([
      api.get('/reports/turnos', { params: filtro }),
      api.get('/reports/stock'),
    ]);
    setTurnos(turnosRes.data);
    setStockCritico(stockRes.data.criticos || []);
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <PageSection
        title="Turnos por sector"
        description="Visualizá la demanda por rango de fechas"
        actions={
          <div className="flex flex-wrap gap-2">
            <input type="date" className="rounded-2xl border px-3 py-1" value={filtro.desde} onChange={(e) => setFiltro({ ...filtro, desde: e.target.value })} />
            <input type="date" className="rounded-2xl border px-3 py-1" value={filtro.hasta} onChange={(e) => setFiltro({ ...filtro, hasta: e.target.value })} />
            <button className="rounded-2xl bg-brand-primary px-3 py-1 text-sm font-semibold" onClick={loadReports}>
              Actualizar
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {turnos.map((sector) => (
            <div key={sector.sectorId} className="rounded-3xl border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Sector #{sector.sectorId}</p>
              <p className="text-3xl font-bold text-slate-800">{sector._count?._all}</p>
              <p className="text-xs text-slate-500">Turnos tomados</p>
            </div>
          ))}
          {turnos.length === 0 && <p className="text-sm text-slate-500">Sin datos para el período seleccionado.</p>}
        </div>
      </PageSection>

      <PageSection title="Stock crítico" description="Insumos por debajo del mínimo recomendado">
        <div className="grid gap-3 md:grid-cols-2">
          {stockCritico.map((item) => (
            <div key={item.id} className="rounded-3xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-lg font-semibold text-rose-900">{item.nombre}</p>
              <p className="text-sm text-rose-700">Cantidad actual: {item.cantidadActual}</p>
              <p className="text-xs text-rose-700">Mínimo requerido: {item.stockMinimo}</p>
            </div>
          ))}
          {stockCritico.length === 0 && <p className="text-sm text-slate-500">Todos los insumos están en niveles saludables.</p>}
        </div>
      </PageSection>
    </div>
  );
}
