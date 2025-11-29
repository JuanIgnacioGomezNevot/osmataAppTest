import { useEffect, useState } from 'react';
import api from '../services/api';
import { PageSection } from '../components/PageSection';

const categorias = ['FARMACIA', 'CIRUGIA', 'ODONTOLOGIA', 'TRAUMATOLOGIA', 'OTROS'];

type StockItem = {
  id: number;
  nombre: string;
  categoria: string;
  cantidadActual: number;
  stockMinimo: number;
  unidadMedida: string;
};

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [form, setForm] = useState({ nombre: '', categoria: 'FARMACIA', cantidadActual: 0, stockMinimo: 0, unidadMedida: 'unidades' });
  const [adjustValues, setAdjustValues] = useState<Record<number, number | ''>>({});
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadStock = async () => {
    const { data } = await api.get('/stock');
    setItems(data);
  };

  useEffect(() => {
    loadStock();
  }, []);

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/stock', form);
    setForm({ nombre: '', categoria: 'FARMACIA', cantidadActual: 0, stockMinimo: 0, unidadMedida: 'unidades' });
    await loadStock();
  };

  const handleAdjustChange = (id: number, value: string) => {
    setAdjustValues((prev) => ({
      ...prev,
      [id]: value === '' ? '' : Number(value),
    }));
  };

  const adjustStock = async (item: StockItem, mode: 'add' | 'remove') => {
    const rawValue = adjustValues[item.id];
    const amount = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (!amount || amount <= 0 || Number.isNaN(amount)) {
      setMessage('Ingresá una cantidad mayor a 0.');
      return;
    }
    if (mode === 'remove' && amount > item.cantidadActual) {
      setMessage('No podés dejar el stock en negativo.');
      return;
    }

    try {
      setProcessingId(item.id);
      const delta = mode === 'add' ? amount : -amount;
      await api.post(`/stock/${item.id}/adjust`, { delta });
      setMessage('Stock actualizado correctamente.');
      setAdjustValues((prev) => ({ ...prev, [item.id]: '' }));
      await loadStock();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || 'No se pudo actualizar el stock.';
      setMessage(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageSection title="Stock de insumos" description="Control en tiempo real del depósito">
        {message && <p className="mb-4 text-sm text-brand-primary dark:text-brand-accent">{message}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-5 shadow-sm transition ${
                item.cantidadActual < item.stockMinimo
                  ? 'border-rose-200/60 bg-rose-50/80 dark:border-rose-500/30 dark:bg-rose-500/10'
                  : 'border-white/30 bg-white/60 dark:border-slate-800/60 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.categoria}</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">{item.nombre}</p>
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{item.cantidadActual}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mínimo: {item.stockMinimo} {item.unidadMedida}</p>
              <div className="mt-4 flex flex-col gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Cantidad"
                  value={adjustValues[item.id] ?? ''}
                  onChange={(e) => handleAdjustChange(item.id, e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="btn-ghost flex-1 justify-center disabled:opacity-50"
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => adjustStock(item, 'remove')}
                  >
                    Restar
                  </button>
                  <button
                    className="btn-primary flex-1 justify-center disabled:opacity-50"
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => adjustStock(item, 'add')}
                  >
                    Sumar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Nuevo producto" description="Agregá insumos farmacéuticos y quirúrgicos">
        <form onSubmit={createItem} className="grid gap-4 md:grid-cols-2">
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
            {categorias.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad"
            value={form.cantidadActual}
            onChange={(e) => setForm({ ...form, cantidadActual: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="Stock mínimo"
            value={form.stockMinimo}
            onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })}
            required
          />
          <input placeholder="Unidad" value={form.unidadMedida} onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })} />
          <button className="btn-primary" type="submit">
            Crear producto
          </button>
        </form>
      </PageSection>
    </div>
  );
}
